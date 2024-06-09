import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/button';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSavePlace } from '@/apis/enter-location';

// 운행 수단
enum Transport {
  public = '지하철',
  car = '자동차',
}

// 입력란의 형식
interface IForm {
  transport: Transport;
  siDo: string;
  siGunGu: string;
  roadNameAddress: string;
  addressLat: number;
  addressLong: number;
}

// 기본 입력란 형태
const default_format: IForm = {
  transport: Transport.public,
  siDo: '',
  siGunGu: '',
  roadNameAddress: '',
  addressLat: 0,
  addressLong: 0,
};

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
      placeRoomId: roomId,
      siDo: data.siDo,
      siGunGu: data.siGunGu,
      roadNameAddress: data.roadNameAddress,
      addressLat: data.addressLat,
      addressLong: data.addressLong,
      transport: data.transport === Transport.public ? 'public' : 'car',
    };

    console.log('입력 완료 요청시 서버로 보내는 값', payload);

    submitLocation(payload);

    setFormLoading(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-1 mb-6 overflow-auto">
        <div className="px-1">
          <div className="flex flex-col items-start justify-between w-full *:rounded-lg gap-3">
            <span className="text-xl font-semibold">이동수단</span>
            <div className="relative w-full">
              <select
                {...register('transport', { required: true })}
                className="w-full bg-indigo-100 border-none rounded-lg outline-none appearance-none ring-0 focus:ring-0"
              >
                {Object.values(Transport).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 flex items-center px-2 pointer-events-none right-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="11" viewBox="0 0 17 11" fill="none">
                  <path
                    d="M6.96356 10.1563C7.76315 11.1158 9.23685 11.1158 10.0364 10.1563L15.7664 3.28036C16.8519 1.97771 15.9256 -9.53674e-07 14.2299 -9.53674e-07H2.77008C1.07441 -9.53674e-07 0.148095 1.97771 1.23364 3.28037L6.96356 10.1563Z"
                    fill="#5142FF"
                  />
                </svg>
              </div>
            </div>
            <span className="text-xl font-semibold">장소입력</span>
            <div className="relative w-full overflow-x-scroll hide-scrollbar hide-x-scrollbar">
              <div
                className={`flex items-center min-w-full h-10 px-3 transition bg-indigo-100 w-max border-none rounded-lg cursor-pointer ring-1 focus:ring-2 ring-indigo-100 ${
                  watch('roadNameAddress') ? 'text-black' : 'text-gray-500'
                }`}
                onClick={openAddressSearch}
              >
                {watch('roadNameAddress') || '주소 입력'}
              </div>
              <input type="hidden" {...register('roadNameAddress', { required: true })} />
            </div>
          </div>
        </div>
      </form>
      <Button isLoading={formLoading} text="입력 완료" onClick={handleSubmit(onSubmit)} />
    </>
  );
}
