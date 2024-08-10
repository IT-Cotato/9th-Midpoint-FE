import KakaoMap from '@/components/common/shared/kakao-map';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { fetchEachSavePlace } from '@/apis/enter-location';
import { default_format, IForm } from '@/types/Location/each';
import Parasol from '@/assets/imgs/Location/parasol.svg?react';
import Button from '@/components/common/Button/button';
import { BACKEND_URL } from '@/apis';
import { FROM_ENTER_EACH, ROOM_TYPE_EACH } from '@/constants';
import NotFound from '../NotFound/not-found';

export default function LocationEach() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [coordinatesList, setCoordinatesList] = useState<{ lat: number; lng: number }[]>([]);
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

            setCoordinatesList([...coordinatesList, { lat: addressLat, lng: addressLong }]);
          }
        });
      },
    }).open();
  };

  // 입력 완료 버튼 클릭 시
  const { mutate: submitLocation } = useMutation({
    mutationFn: (data: IForm) => fetchEachSavePlace(data, roomId!),
    onSuccess: (data) => {
      console.log('입력 완료 API 요청 성공:', data);
      queryClient.invalidateQueries({ queryKey: ['eachOthers', roomId] }); // 장소입력에 대한 revalidate
      navigate(`/page/e/results/${roomId}`);
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

  // react-query로 바꾸고 개개인에 대해 post요청시 revalidate하도록 수정
  useEffect(() => {
    async function handleEnterEach() {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/place-rooms`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            RoomId: roomId,
            RoomType: ROOM_TYPE_EACH,
          },
        });

        if (data.isSuccess) {
          const { myPlace, myPlaceExistence, otherPlaces } = data.data;

          // 사용자의 장소가 존재하는 경우 폼에 데이터를 채움
          if (myPlaceExistence) {
            setValue('siDo', myPlace.siDo);
            setValue('siGunGu', myPlace.siGunGu);
            setValue('roadNameAddress', myPlace.roadNameAddress);
            setValue('addressLat', myPlace.addressLat);
            setValue('addressLong', myPlace.addressLong);
          }

          // 다른 사람의 장소들을 coordinatesList에 저장
          if (otherPlaces) {
            console.log('다른사람들의 장소 location-each.tsx', otherPlaces);
            const coordinates = otherPlaces.map((place: any) => ({
              lat: place.addressLat,
              lng: place.addressLong,
            }));
            setCoordinatesList(coordinates);
          }
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate(`/page/login/${roomId}`, { state: { from: FROM_ENTER_EACH } });
        }
        if (error.response && error.response.status === 422) {
          return <NotFound />;
        }
      }
    }

    handleEnterEach();
  }, [roomId, setValue]);

  // 폼이 변경될 때 지도에 반영되도록 함
  useEffect(() => {
    const subscription = watch((value) => {
      if (value.addressLat && value.addressLong) {
        setCoordinatesList([{ lat: value.addressLat, lng: value.addressLong }]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <div className="grid w-4/5 grid-cols-2 gap-3 grid-rows-[auto_1fr]">
        <div className="rounded-2xl bg-[#F8F8FB] row-span-1 px-2 py-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-1 mb-6">
            <div className="flex flex-col w-full *:rounded-lg gap-3">
              <div className="flex flex-col items-center gap-2 my-4">
                <Parasol />
                <span className="text-2xl font-semibold text-[#1A3C95]">내 정보 입력</span>
              </div>
              <div className="relative w-full">
                <div
                  className={`flex items-center min-w-full min-h-10 px-3  bg-white w-max border-none rounded-lg cursor-pointer  ${
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
            isMoreMessage="중간지점 찾기"
            text="중간지점 찾기"
            onClick={handleSubmit(onSubmit)}
          />
        </div>
        <div className="rounded-2xl h-[500px] shadow-lg row-span-5">
          <KakaoMap coordinates={coordinatesList} />
        </div>
      </div>
    </>
  );
}
