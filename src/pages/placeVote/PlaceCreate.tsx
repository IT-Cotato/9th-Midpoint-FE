//placeAlone 가져옴
// import { axiosInstance } from '@/apis/index.api';
import KakaoMap from '@/components/common/shared/kakao-map';
import { QUERY_KEYS } from '@/constants';
import FountainIcon from '@/assets/imgs/PlaceVote/fountainIcon.svg?react';
import PenIcon from '@/assets/imgs/PlaceVote/penIcon.svg?react';
import XIcon from '@/assets/imgs/PlaceVote/xIcon.svg?react';
import {
  create_place_vote_default_format,
  CreateSubmissionData,
  IPlaceVoteForm,
} from '@/types/Location';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPlaceRoomExists } from '@/apis/existence.api';
import { postPlaceVoteRoom, putPlaceVoteRoom } from '@/apis/place-vote.api';

export default function PlaceCreate() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 투표방 생성 로딩 상태
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number }[]
  >([]); // 사용자들의 좌표 목록
  const [isVoteRoomExists, setVoteRoomExists] = useState<boolean>(false); // 투표방 생성 여부
  const queryClient = useQueryClient();
  const { control, register, handleSubmit, setValue, watch } =
    useForm<IPlaceVoteForm>({
      defaultValues: {
        friendList: [create_place_vote_default_format],
      },
    });
  const { fields, remove, replace } = useFieldArray({
    control,
    name: 'friendList',
  });

  // 주소 검색하는 함수
  const openAddressSearch = (index: number) => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const fullAddress = data.roadAddress;
        const siDo = data.sido;
        const siGunGu = data.sigungu;
        const roadNameAddress = data.roadAddress;

        // Kakao 지도 API를 사용하여 위도와 경도 가져오기
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(
          fullAddress,
          function (result: any, status: any) {
            if (status === window.kakao.maps.services.Status.OK) {
              const addressLat = parseFloat(result[0].y);
              const addressLong = parseFloat(result[0].x);

              // 주소와 좌표 설정
              setValue(`friendList.${index}.name`, roadNameAddress);
              setValue(`friendList.${index}.siDo`, siDo);
              setValue(`friendList.${index}.siGunGu`, siGunGu);
              setValue(`friendList.${index}.roadNameAddress`, roadNameAddress);
              setValue(`friendList.${index}.addressLat`, addressLat);
              setValue(`friendList.${index}.addressLong`, addressLong);

              setCoordinates((prev) => {
                const newCoordinates = [...prev];
                newCoordinates[index] = { lat: addressLat, lng: addressLong };
                return newCoordinates;
              });
            }
          },
        );
      },
    }).open();
  };

  //투표방 존재 여부
  const { data: placeVoteData } = useQuery({
    queryKey: [QUERY_KEYS.IS_EXISTS_PLACEVOTE_ROOM, roomId],
    queryFn: () => getPlaceRoomExists(roomId!),
    enabled: !!roomId,
  });
  // 투표방 생성 여부 확인
  useEffect(() => {
    if (placeVoteData) {
      setVoteRoomExists(placeVoteData.existence);
      if (placeVoteData.existence) {
        // placeCandidates가 비어있지 않은지 확인
        if (
          placeVoteData.placeCandidates &&
          placeVoteData.placeCandidates.length > 0
        ) {
          replace(placeVoteData.placeCandidates);
        } else {
          console.warn('No place candidates found in the existing vote room.');
        }
      }
    }
  }, [placeVoteData, replace]);

  //투표방 생성
  const { mutate: createPlaceVoteRoom } = useMutation({
    mutationKey: [QUERY_KEYS.FROM_CREATE_PLACE_VOTE],
    mutationFn: (payload: CreateSubmissionData[]) =>
      postPlaceVoteRoom(payload, roomId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IS_EXISTS_PLACEVOTE_ROOM, roomId],
      });
      navigate(`/page/place/vote/${roomId}`);
    },
  });

  //투표방 재생성
  const { mutate: updatePlaceVoteRoom } = useMutation({
    mutationKey: [QUERY_KEYS.FROM_CREATE_PLACE_VOTE],
    mutationFn: (payload: CreateSubmissionData[]) =>
      putPlaceVoteRoom(payload, roomId!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IS_EXISTS_PLACEVOTE_ROOM, roomId],
      });
      navigate(`/page/place/vote/${roomId}`);
    },
  });

  // 투표 생성하기 버튼 클릭 시 수행되는 함수
  const onSubmit = async (data: IPlaceVoteForm) => {
    setIsLoading(true);

    const allFieldsFilled = data.friendList.every(
      (friend) =>
        friend.name &&
        friend.roadNameAddress &&
        friend.siDo &&
        friend.siGunGu &&
        friend.addressLat &&
        friend.addressLong,
    );

    if (!allFieldsFilled) {
      setIsLoading(false);
      alert('장소를 모두 포함해주세요!');
      return;
    }

    const submissionData: CreateSubmissionData[] = data.friendList.map(
      ({ name, siDo, siGunGu, roadNameAddress, addressLat, addressLong }) => ({
        name,
        siDo,
        siGunGu,
        roadNameAddress,
        addressLat,
        addressLong,
      }),
    );
    if (!isVoteRoomExists) {
      createPlaceVoteRoom(submissionData);
    } else {
      updatePlaceVoteRoom(submissionData);
    }

    // try {
    //   if (!isVoteRoomExists) {
    //     await axiosInstance.post(
    //       '/api/place-vote-rooms',
    //       { placeCandidates: submissionData },
    //       {
    //         headers: {
    //           RoomId: roomId,
    //           RoomType: ROOM_TYPE_ALONE,
    //         },
    //       },
    //     );
    //     queryClient.invalidateQueries({
    //       queryKey: ['placeVoteRoomExists', roomId],
    //     });
    //   } else {
    //     await axiosInstance.put(
    //       '/api/place-vote-rooms',
    //       { placeCandidates: submissionData },
    //       {
    //         headers: {
    //           RoomId: roomId,
    //           RoomType: ROOM_TYPE_ALONE,
    //         },
    //       },
    //     );
    //   }
    // } catch (error: any) {
    //   console.log('장소 투표방 생성 에러', error);
    // }

    setIsLoading(false);
  };

  // 친구 삭제 시 좌표 정보도 제거하는 함수
  const handleRemove = (index: number) => {
    remove(index);
    setCoordinates((prev) => prev.filter((_, i) => i !== index));
  };

  // useEffect(() => {
  //   async function fetchPlaceVoteRoomInfo() {
  //     try {
  //       const { data } = await axiosInstance.get('/api/place-vote-rooms', {
  //         headers: {
  //           RoomId: roomId,
  //           RoomType: ROOM_TYPE_ALONE,
  //         },
  //       });

  //       const { existence, placeCandidates } = data.data;
  //       setVoteRoomExists(existence);

  //       if (existence) {
  //         // 이미 생성된 투표방이 있는 경우 placeCandidates 값을 사용하여 replace
  //         const formattedCandidates = placeCandidates.map((candidate: any) => ({
  //           name: candidate.name,
  //           siDo: candidate.siDo,
  //           siGunGu: candidate.siGunGu,
  //           roadNameAddress: candidate.roadNameAddress,
  //           addressLat: candidate.addressLat,
  //           addressLong: candidate.addressLong,
  //         }));
  //         replace(formattedCandidates);

  //         placeCandidates.forEach((candidate: any, index: number) => {
  //           setValue(`friendList.${index}.name`, candidate.name);
  //           setValue(
  //             `friendList.${index}.roadNameAddress`,
  //             `${candidate.siDo} ${candidate.siGunGu} ${candidate.name}`,
  //           );
  //           setValue(`friendList.${index}.siDo`, candidate.siDo);
  //           setValue(`friendList.${index}.siGunGu`, candidate.siGunGu);
  //           setValue(`friendList.${index}.addressLat`, candidate.addressLat);
  //           setValue(`friendList.${index}.addressLong`, candidate.addressLong);
  //         });

  //         // 좌표 목록 업데이트
  //         setCoordinates(
  //           placeCandidates.map((candidate: any) => ({
  //             lat: candidate.addressLat,
  //             lng: candidate.addressLong,
  //           })),
  //         );
  //       } else {
  //         // 생성된 투표방이 없는 경우 중간지점 목록 조회
  //         try {
  //           const { data: midPointsData } = await axiosInstance.get(
  //             '/api/mid-points',
  //             {
  //               headers: {
  //                 RoomId: roomId,
  //                 RoomType: ROOM_TYPE_ALONE,
  //               },
  //             },
  //           );
  //           const { data: places } = midPointsData;

  //           const formattedPlaces = places.map((place: any) => ({
  //             name: place.name,
  //             siDo: place.siDo,
  //             siGunGu: place.siGunGu,
  //             roadNameAddress: place.roadNameAddress,
  //             addressLat: place.addressLat,
  //             addressLong: place.addressLong,
  //           }));

  //           replace(formattedPlaces);

  //           // 필드의 값을 업데이트하여 텍스트가 표시되도록 설정
  //           places.forEach((place: any, index: number) => {
  //             setValue(`friendList.${index}.name`, place.name);
  //             setValue(
  //               `friendList.${index}.roadNameAddress`,
  //               `${place.siDo} ${place.siGunGu} ${place.name}`,
  //             );
  //             setValue(`friendList.${index}.siDo`, place.siDo);
  //             setValue(`friendList.${index}.siGunGu`, place.siGunGu);
  //             setValue(`friendList.${index}.addressLat`, place.addressLat);
  //             setValue(`friendList.${index}.addressLong`, place.addressLong);
  //           });

  //           // 좌표 목록 업데이트
  //           setCoordinates(
  //             places.map((place: any) => ({
  //               lat: place.addressLat,
  //               lng: place.addressLong,
  //             })),
  //           );
  //         } catch (error: any) {
  //           if (error.response && error.response.status === 401) {
  //             navigate(`/page/login/${roomId}`, {
  //               state: { from: FROM_ALONE_CREATE_VOTE_PLACE },
  //             });
  //           }
  //           if (error.response && error.response.status === 403) {
  //             navigate(`/page/alone/${roomId}`, {
  //               state: { from: FROM_ALONE_CREATE_VOTE_PLACE },
  //             });
  //           }
  //           if (error.response && error.response.status === 422) {
  //             navigate('/not-found');
  //           }
  //         }
  //       }
  //     } catch (error: any) {
  //       if (error.response && error.response.status === 401) {
  //         navigate(`/page/login/${roomId}`, {
  //           state: { from: FROM_ALONE_CREATE_VOTE_PLACE },
  //         });
  //       }
  //       if (error.response && error.response.status === 403) {
  //         navigate(`/page/alone/${roomId}`, {
  //           state: { from: FROM_ALONE_CREATE_VOTE_PLACE },
  //         });
  //       }
  //       if (error.response && error.response.status === 422) {
  //         navigate('/not-found');
  //       }
  //     }
  //   }

  //   fetchPlaceVoteRoomInfo();
  // }, [roomId, replace, setValue]);

  return (
    <>
      <div className="grid w-4/5 gap-3 grid-cols-2 grid-rows-[auto_1fr]">
        <div className="bg-[#F8F8FB] rounded-2xl shadow-lg flex flex-col justify-between gap-2 px-2 pt-8 row-span-2 py-2 h-[560px]">
          <div className="flex flex-col items-center gap-2">
            <FountainIcon />
            <h1 className="text-2xl font-semibold text-[#1A3C95] mb-2">
              장소 투표 생성하기
            </h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-grow gap-3 py-1"
          >
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="relative w-full overflow-x-auto">
                  <div className="absolute flex items-center gap-2 *:cursor-pointer top-3 right-3">
                    <PenIcon
                      className="size-6"
                      onClick={() => openAddressSearch(index)}
                    />
                    {fields.length > 1 && (
                      <XIcon
                        className="size-6"
                        onClick={() => handleRemove(index)}
                      />
                    )}
                  </div>
                  <div
                    className={`flex items-center min-w-full min-h-10 h-14 px-3 bg-white w-max border-none rounded-2xl cursor-pointer ${
                      watch(`friendList.${index}.roadNameAddress`)
                        ? 'text-black'
                        : 'text-gray-500'
                    }`}
                    onClick={() => openAddressSearch(index)}
                  >
                    {watch(`friendList.${index}.roadNameAddress`) ||
                      '출발 장소'}
                  </div>
                  <input
                    type="hidden"
                    {...register(
                      `friendList.${index}.roadNameAddress` as const,
                      { required: true },
                    )}
                  />
                </div>
              </div>
            ))}
          </form>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="w-full h-14 rounded-2xl primary-btn min-h-10 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              투표 생성하기
            </button>
          </div>
        </div>
        <div className="h-[560px] shadow-lg rounded-2xl row-span-2">
          <KakaoMap coordinates={coordinates} />
        </div>
      </div>
    </>
  );
}
