import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { fetchEachSavePlace } from '@/apis/enter-location';
import { default_format, IForm } from '@/types/Location/each';
import Parasol from '@/assets/imgs/Location/parasol.svg?react';
import Button from '@/components/common/Button/button';
import { axiosInstance, BACKEND_URL } from '@/apis';
import {
  FROM_EACH_CREATE_VOTE_PLACE,
  FROM_EACH_CREATE_VOTE_TIME,
  FROM_EACH_PLACE_VOTE,
  FROM_EACH_PLACE_VOTE_RESULT,
  FROM_EACH_TIME_VOTE,
  FROM_EACH_TIME_VOTE_RESULT,
  FROM_ENTER_EACH,
  ROOM_TYPE_EACH,
} from '@/constants';
import EnterEachMap from '@/components/common/shared/EnterEachMap';

export default function LocationEach() {
  const location = useLocation();
  const from = location.state?.from;

  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [coordinatesList, setCoordinatesList] = useState<{ lat: number; lng: number }[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { register, handleSubmit, setValue, watch } = useForm<IForm>({
    defaultValues: default_format,
  });

  // 주소 입력 후 지도에 반영
  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const fullAddress = data.roadAddress;
        const siDo = data.sido;
        const siGunGu = data.sigungu;
        const roadNameAddress = data.roadAddress;

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(fullAddress, function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const addressLat = parseFloat(result[0].y);
            const addressLong = parseFloat(result[0].x);

            setValue('siDo', siDo);
            setValue('siGunGu', siGunGu);
            setValue('roadNameAddress', roadNameAddress);
            setValue('addressLat', addressLat);
            setValue('addressLong', addressLong);

            const newCoords = { lat: addressLat, lng: addressLong };

            if (userCoordinates) {
              setCoordinatesList((prev) => {
                const filteredPrev = prev.filter(
                  (coord) => coord.lat !== userCoordinates.lat || coord.lng !== userCoordinates.lng,
                );
                return [newCoords, ...filteredPrev];
              });
            } else {
              setCoordinatesList((prev) => {
                return [...prev, newCoords];
              });
            }
            setUserCoordinates(newCoords);
          }
        });
      },
    }).open();
  };

  // 입력 완료 버튼 클릭 시
  const { mutate: submitLocation } = useMutation({
    mutationFn: (data: IForm) => fetchEachSavePlace(data, roomId!),
    onSuccess: () => {
      switch (from) {
        case FROM_EACH_CREATE_VOTE_PLACE:
          navigate(`/page/e/create/place-vote-room/${roomId}`);
          break;
        case FROM_EACH_PLACE_VOTE:
          navigate(`/page/e/place-vote/${roomId}`);
          break;
        case FROM_EACH_PLACE_VOTE_RESULT:
          navigate(`/page/e/place-vote/results/${roomId}`);
          break;
        case FROM_EACH_CREATE_VOTE_TIME:
          navigate(`/page/e/create/time-vote-room/${roomId}`);
          break;
        case FROM_EACH_TIME_VOTE:
          navigate(`/page/e/time-vote/${roomId}`);
          break;
        case FROM_EACH_TIME_VOTE_RESULT:
          navigate(`/page/e/time-vote/results/${roomId}`);
          break;
        default:
          navigate(`/page/e/results/${roomId}`);
      }
    },
    onError: (error) => {
      console.error('입력 완료 API 요청 실패:', error);
    },
  });

  const onSubmit = (data: IForm) => {
    setIsLoading(true);

    const payload: IForm = {
      siDo: data.siDo,
      siGunGu: data.siGunGu,
      roadNameAddress: data.roadNameAddress,
      addressLat: data.addressLat,
      addressLong: data.addressLong,
    };

    submitLocation(payload);

    setIsLoading(false);
  };

  useEffect(() => {
    async function handleEnterEach() {
      try {
        const { data } = await axiosInstance.get(`${BACKEND_URL}/api/place-rooms`, {
          headers: {
            RoomId: roomId,
            RoomType: ROOM_TYPE_EACH,
          },
        });

        if (data.isSuccess) {
          const { myPlace, myPlaceExistence, otherPlaces } = data.data;
          const combinedCoords = [];

          // 사용자의 장소가 존재하는 경우
          if (myPlaceExistence) {
            setValue('siDo', myPlace.siDo);
            setValue('siGunGu', myPlace.siGunGu);
            setValue('roadNameAddress', myPlace.roadNameAddress);
            setValue('addressLat', myPlace.addressLat);
            setValue('addressLong', myPlace.addressLong);

            const userCoords = { lat: myPlace.addressLat, lng: myPlace.addressLong };
            setUserCoordinates(userCoords);
            combinedCoords.push(userCoords); // 사용자의 위치를 추가
          }

          // 다른 사람의 장소들을 coordinatesList에 추가
          if (otherPlaces) {
            const otherCoords = otherPlaces.map((place: any) => ({
              lat: place.addressLat,
              lng: place.addressLong,
            }));
            combinedCoords.push(...otherCoords);
          }

          setCoordinatesList(combinedCoords); // 모든 좌표를 한 번에 설정
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate(`/page/login/${roomId}`, { state: { from: FROM_ENTER_EACH } });
        }
        if (error.response && error.response.status === 422) {
          navigate('/not-found');
        }
      }
    }

    handleEnterEach();
  }, [roomId, setValue]);

  return (
    <>
      <div className="grid w-4/5 grid-cols-2 gap-3 grid-rows-[auto_1fr]">
        <div className="rounded-2xl bg-[#F8F8FB] row-span-1 px-4 py-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-1 mb-6">
            <div className="flex flex-col w-full gap-3">
              <div className="flex flex-col items-center gap-2 my-4">
                <Parasol />
                <span className="text-2xl font-semibold text-[#1A3C95] ml-2">내 정보 입력</span>
              </div>
              <div className="relative w-full">
                <div
                  className={`flex items-center min-w-full h-14 px-3 pl-4 bg-white w-max border-none rounded-xl cursor-pointer ${
                    watch('roadNameAddress') ? 'text-black' : 'text-gray-500'
                  }`}
                  onClick={openAddressSearch}
                >
                  {watch('roadNameAddress') || '주소 입력'}
                </div>
                <input type="hidden" {...register('roadNameAddress', { required: true })} />
              </div>
            </div>
          </form>
          <Button
            isLoading={isLoading}
            isMore={!Boolean(watch('roadNameAddress'))}
            isMoreMessage="중간 지점 찾기"
            text="중간 지점 찾기"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
        <div className="rounded-2xl h-[500px] shadow-lg row-span-5">
          <EnterEachMap
            coordinates={coordinatesList.length === 0 ? [] : coordinatesList}
            selectedCoordinate={userCoordinates}
          />
        </div>
      </div>
    </>
  );
}
