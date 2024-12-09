//MidpointResult/MidpointAloneResult.tsx 가져옴
// import { axiosInstance, BACKEND_URL } from '@/apis/index.api';
import { QUERY_KEYS } from '@/constants';
import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Loading from '../Loading/loading';
import BooksIcon from '@/assets/imgs/Midpoints/books.svg?react';
import CafeIcon from '@/assets/imgs/Midpoints/cafe.svg?react';
import RestaurantIcon from '@/assets/imgs/Midpoints/restaurant.svg?react';
import LinkIcon from '@/assets/imgs/Midpoints/link.svg?react';
import PrevBtn from '@/assets/imgs/Midpoints/prevBtn.svg?react';
import NextBtn from '@/assets/imgs/Midpoints/netBtn.svg?react';
import MidpointMap from '@/components/common/shared/MidpointMap';
import { getRecommendPlaces } from '@/apis/location.api';
import { useQuery } from '@tanstack/react-query';
import { handleApiErrorCase } from '@/apis/existence.api';
import { Coordinate, IContents, IRecommendPlaces } from '@/types/location';

export default function Recommend() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [selectedCoordinate, setSelectedCoordinate] =
    useState<Coordinate | null>(null);
  const [clickedItemNum, setClickedItemNum] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<IContents[]>([]);
  const [clickedOption, setClickedOption] = useState<
    IRecommendPlaces['placeStandard']
  >(QUERY_KEYS.PLACE_ALL);
  const [loading, setLoading] = useState<boolean>(true);

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const name = searchParams.get('name');

  // 쿼리 키와 페이로드 정의
  const payload = {
    addressLat: Number(lat),
    addressLong: Number(lng),
    placeStandard: clickedOption,
    page: currentPage,
  };

  // 중간 지점 추천 장소 조회
  const { data, error, isError } = useQuery({
    queryKey: [QUERY_KEYS.PLACE_RECOMMEND],
    queryFn: () => getRecommendPlaces(payload),
    enabled: !!lat && !!lng && !!name,
  });

  //성공
  useEffect(() => {
    if (data) {
      setClickedItemNum(0);
      setRecommendations(data.data.content);
      setTotalPages(data.data.totalPages);
      if (data.data.content.length > 0) {
        setCoordinates(
          data.data.content.map(
            ({ name, addressLat, addressLong }: IContents) => ({
              lat: addressLat,
              lng: addressLong,
              name,
            }),
          ),
        );
        setSelectedCoordinate({
          lat: data.data.content[0].addressLat,
          lng: data.data.content[0].addressLong,
          name: data.data.content[0].name,
        });
      }
      setLoading(false);
    }
  }, [data]);

  //에러처리
  useEffect(() => {
    if (isError && error) {
      handleApiErrorCase(error, roomId!, { from: QUERY_KEYS.FROM_RESULT });
    }
  }, [isError, error, roomId]);

  // useEffect(() => {
  //   if (!lat || !lng || !name) {
  //     navigate('/not-found');
  //     return;
  //   }

  //   async function fetchRecommendations(page: number) {
  //     try {
  //       const { data } = await axiosInstance.get(
  //         `${BACKEND_URL}/api/recommend-places`,
  //         {
  //           headers: {
  //             RoomId: roomId!,
  //             RoomType: ROOM_TYPE_ALONE,
  //           },
  //           params: {
  //             addressLat: lat,
  //             addressLong: lng,
  //             placeStandard: clickedOption,
  //             page: page,
  //           },
  //         },
  //       );
  //       setClickedItemNum(0);
  //       setRecommendations(data.data.content);
  //       setTotalPages(data.data.totalPages);
  //       if (data.data.content) {
  //         setCoordinates(
  //           data.data.content.map(
  //             ({ name, addressLat, addressLong }: IContents) => ({
  //               lat: addressLat,
  //               lng: addressLong,
  //               name,
  //             }),
  //           ),
  //         );
  //         setSelectedCoordinate({
  //           lat: data.data.content[0].addressLat,
  //           lng: data.data.content[0].addressLong,
  //           name: data.data.content[0].name,
  //         });
  //       }
  //       setLoading(false);
  //     } catch (error: any) {
  //       if (error.response && error.response.status === 401) {
  //         navigate(`/page/login/${roomId}`, {
  //           state: { from: FROM_ALONE_RESULT },
  //         });
  //       }
  //       if (error.response && error.response.status === 403) {
  //         navigate(`/page/alone/${roomId}`);
  //       }
  //       if (error.response && error.response.status === 422) {
  //         navigate('/not-found');
  //       }
  //       setLoading(false);
  //     }
  //   }

  //   fetchRecommendations(currentPage);
  // }, [lat, lng, name, navigate, roomId, currentPage, clickedOption]);

  useEffect(() => {
    setCurrentPage(1);
  }, [clickedOption]);

  function handleClickItem(
    name: string,
    addressLat: number,
    addressLong: number,
    index: number,
  ) {
    setClickedItemNum(index);
    setSelectedCoordinate({ lat: addressLat, lng: addressLong, name });
  }

  function handlePageClick(page: number) {
    if (page < totalPages!) {
      setCurrentPage(page);
    }
  }

  function handleClickedOption(option: IRecommendPlaces['placeStandard']) {
    setClickedOption(option);
  }

  function renderPageNumbers() {
    const pages = [];
    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages! - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`p-1 px-5 rounded-md ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>,
      );
      if (i === totalPages) break;
    }

    return pages;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-4/5 gap-3">
      <div className="flex items-center w-full">
        <span className="w-1/2 font-semibold text-[#2F5FDD] text-lg">
          {name}에서 뭐하지?
        </span>
        <ul className="flex w-1/2 gap-2 *:font-semibold *:cursor-pointer *:rounded-3xl *:py-[6px] *:px-4 *:w-max *:shadow-md ">
          <li
            onClick={() => handleClickedOption(QUERY_KEYS.PLACE_ALL)}
            className={`transition-colors ${clickedOption === QUERY_KEYS.PLACE_ALL ? 'bg-blue-500 text-white' : ''}`}
          >
            전체
          </li>
          <li
            className={`flex gap-2 transition-colors ${clickedOption === QUERY_KEYS.PLACE_STUDY ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => handleClickedOption(QUERY_KEYS.PLACE_STUDY)}
          >
            <BooksIcon /> <span>스터디</span>
          </li>
          <li
            className={`flex gap-2 transition-colors ${clickedOption === QUERY_KEYS.PLACE_CAFE ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => handleClickedOption(QUERY_KEYS.PLACE_CAFE)}
          >
            <CafeIcon />
            <span>카페</span>
          </li>
          <li
            className={`flex gap-2 transition-colors ${clickedOption === QUERY_KEYS.PLACE_RESTAURANT ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => handleClickedOption(QUERY_KEYS.PLACE_RESTAURANT)}
          >
            <RestaurantIcon />
            <span>식당</span>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-2 w-full gap-3 grid-rows-[auto_1fr]">
        <div className="h-[700px] rounded-2xl shadow-lg">
          <MidpointMap
            coordinates={coordinates}
            selectedCoordinate={selectedCoordinate}
          />
        </div>
        <div className="flex flex-col gap-3">
          {recommendations.map(
            (
              {
                name,
                siDo,
                siGunGu,
                roadNameAddress,
                placeUrl,
                phoneNumber,
                addressLat,
                addressLong,
                placeStandard,
              },
              index,
            ) => (
              <div
                key={index}
                className={`bg-[#F8F8FB] rounded-2xl cursor-pointer flex flex-col p-3 pl-6 gap-1 transition-all ${
                  clickedItemNum === index
                    ? 'bg-blue-100 opacity-95 ring-2 ring-blue-500'
                    : ''
                } h-max`}
                onClick={() =>
                  handleClickItem(name, addressLat, addressLong, index)
                }
              >
                <div className="*:font-semibold *:text-[#1A3C95] pt-1">
                  {placeStandard === QUERY_KEYS.PLACE_STUDY && (
                    <span className="flex gap-2 ">
                      <BooksIcon />
                      <h1>스터디</h1>
                    </span>
                  )}
                  {placeStandard === QUERY_KEYS.PLACE_CAFE && (
                    <span className="flex gap-2">
                      <CafeIcon />
                      <h1>카페</h1>
                    </span>
                  )}
                  {placeStandard === QUERY_KEYS.PLACE_RESTAURANT && (
                    <span className="flex gap-2">
                      <RestaurantIcon />
                      <h1>식당</h1>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 ">
                  <h1 className="text-xl text-[#2F5FDD] font-semibold">
                    {name}
                  </h1>
                  <span>
                    <Link to={placeUrl} target="_blank">
                      <LinkIcon
                        className={`rounded-lg transition-all ${clickedItemNum === index ? 'hover:scale-110' : ''}`}
                      />
                    </Link>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#5E6D93]">
                    {siDo} {siGunGu} {roadNameAddress}
                  </span>
                  <span className="text-[#2F5FDD] bg-[#EFF3FF] font-semibold p-1 rounded-lg">
                    {phoneNumber}
                  </span>
                </div>
              </div>
            ),
          )}
          <div className="flex items-center justify-center gap-2 mt-4">
            {currentPage > 5 && (
              <button
                onClick={() =>
                  handlePageClick(Math.floor((currentPage - 1) / 5) * 5)
                }
              >
                <PrevBtn />
              </button>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages! &&
              Math.floor((currentPage - 1) / 5) * 5 + 5 < totalPages! && (
                <button
                  onClick={() =>
                    handlePageClick(
                      Math.min(
                        Math.floor((currentPage - 1) / 5) * 5 + 6,
                        totalPages!,
                      ),
                    )
                  }
                >
                  <NextBtn />
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
