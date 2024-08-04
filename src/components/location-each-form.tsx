import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/button';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSavePlace } from '@/apis/enter-location';
import { default_format, IForm } from '@/types/Location/each';
import Parasol from '@/assets/imgs/Location/parasol.svg?react';

export default function LocationEachForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const [formLoading, setFormLoading] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch } = useForm<IForm>({
    defaultValues: default_format,
  });

  // 주소 검색하는 함수
  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const fullAddress = data.roadAddress;
        const siDo = data.sido;
        const siGunGu = data.sigungu;
        const roadNameAddress = data.roadAddress;

        // Kakao 지도 API를 사용하여 위도와 경도 가져오기
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(fullAddress, function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const addressLat = parseFloat(result[0].y);
            const addressLong = parseFloat(result[0].x);

            // 주소와 좌표 설정
            setValue('siDo', siDo);
            setValue('siGunGu', siGunGu);
            setValue('roadNameAddress', roadNameAddress);
            setValue('addressLat', addressLat);
            setValue('addressLong', addressLong);
          }
        });
      },
    }).open();
  };

  // 입력 완료 버튼 클릭시 API 요청
  const { mutate: submitLocation } = useMutation({
    mutationFn: fetchSavePlace,
    onSuccess: (data, variable) => {
      // 장소 입력 방에 저장된 사람들의 정보 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ['placeRoomUsers', roomId] });
      console.log('API 요청 성공');
      console.log('입력 완료 API 요청시 보낸 데이터', variable);
      console.log('입력 완료 API 요청 이후 받은 응답 데이터', data);
    },
    onError: (error) => {
      console.error(`입력 완료 API 요청 실패, 에러명 : ${error}`);
    },
  });

  const onSubmit = (data: IForm) => {
    setFormLoading(true);

    const payload = {
      siDo: data.siDo,
      siGunGu: data.siGunGu,
      roadNameAddress: data.roadNameAddress,
      addressLat: data.addressLat,
      addressLong: data.addressLong,
    };

    console.log('입력 완료 요청시 서버로 보내는 값', payload);

    submitLocation(payload);

    setFormLoading(false);
  };
  return (
    <>
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
        isLoading={formLoading}
        isMore={!Boolean(watch('roadNameAddress'))}
        isMoreMessage="중간지점 찾기"
        text="중간지점 찾기"
        onClick={handleSubmit(onSubmit)}
      />
    </>
  );
}
