import Button from '@/components/button';
import KakaoMap from '@/components/kakao-map';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

// 운행 수단
enum Transport {
  public = '지하철',
  car = '자동차',
}

// 입력란의 형식
interface IFriendList {
  readonly username: string;
  readonly transport: Transport;
  readonly siDo: string;
  readonly siGunGu: string;
  readonly roadNameAddress: string;
  readonly addressLat: number;
  readonly addressLong: number;
}

// 입력 폼으로 부터 받은 값의 형식
interface IForm {
  readonly friendList: IFriendList[];
}

// 입력란의 기본 형태 템플릿
const default_format: IFriendList = {
  username: '',
  transport: Transport.public,
  siDo: '',
  siGunGu: '',
  roadNameAddress: '',
  addressLat: 0,
  addressLong: 0,
};

export default function LocationAlone() {
  const [isLoading, setIsLoading] = useState(false); // form제출 상태
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }[]>([]); // 사용자들의 좌표 목록
  const { control, register, handleSubmit, setValue, watch } = useForm<IForm>({
    defaultValues: {
      friendList: [default_format],
    },
  });
  const { fields, append } = useFieldArray({
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
        geocoder.addressSearch(fullAddress, function (result: any, status: any) {
          if (status === window.kakao.maps.services.Status.OK) {
            const addressLat = parseFloat(result[0].y);
            const addressLong = parseFloat(result[0].x);

            // 주소와 좌표 설정
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
        });
      },
    }).open();
  };

  // 중간지점찾기 API 요청
  const { mutate: searchMiddlePoint } = useMutation({
    mutationFn: (data: any) => {
      return axios.post('/api/middle-points', data);
    },
    onSuccess: (data, variable) => {
      console.log('API 요청 성공');
      console.log('중간지점찾기 API 요청시 보낸 데이터', variable);
      console.log('중간지점찾기 API 요청 이후 받은 응답 데이터', data);
    },
    onError: (error) => {
      console.error(`중간 지점 결과 조회 API 요청 실패, 에러명 : ${error}`);
      setIsLoading(false);
    },
  });

  // 중간지점찾기 버튼 클릭시 수행되는 함수
  const onSubmit = (data: IForm) => {
    setIsLoading(true);
    const allFieldsFilled = data.friendList.every(
      (friend) =>
        friend.username &&
        friend.transport &&
        friend.roadNameAddress &&
        friend.siDo &&
        friend.siGunGu &&
        friend.addressLat &&
        friend.addressLong,
    );

    if (!allFieldsFilled) {
      setIsLoading(false);
      alert('모두 입력해주세요!');
      return;
    }

    const submissionData = data.friendList.map(({ username, transport, ...rest }) => ({
      ...rest,
      transport: transport === Transport.public ? 'PUBLIC' : 'CAR',
    }));

    console.log('중간지점 찾기 요청시 서버로 보내는 값', submissionData);

    searchMiddlePoint(submissionData, {
      onSuccess: () => {
        console.log('2번째로 불림- API 요청 성공');
      },
      onError: (error) => {
        console.error(`2번째로 불림 중간 지점 결과 조회 API 요청 실패, 에러명 : ${error}`);
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="flex w-full gap-20 min-w-[1024px] justify-center mt-20">
      <div className="w-[45%] min-w-[540px] h-96 flex flex-col gap-3">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-1 overflow-auto">
          {fields.map((field, index) => (
            <div key={field.id} className="px-1">
              <h2 className="text-lg font-semibold">친구 {index + 1}</h2>
              <div className="flex items-center justify-between w-full *:rounded-lg gap-3">
                <input
                  {...register(`friendList.${index}.username` as const, { required: true })}
                  placeholder="이름 입력"
                  className="w-40 transition bg-indigo-100 border-none ring-1 focus:ring-2 ring-indigo-100 focus:outline-none"
                />
                <div className="relative w-40">
                  <select
                    {...register(`friendList.${index}.transport` as const, { required: true })}
                    className="w-40 bg-indigo-100 border-none rounded-lg outline-none appearance-none ring-0 focus:ring-0"
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
                <div className="relative overflow-x-scroll w-72 hide-scrollbar hide-x-scrollbar">
                  <div
                    className={`flex items-center min-w-full h-10 px-3 transition bg-indigo-100 w-max border-none rounded-lg cursor-pointer ring-1 focus:ring-2 ring-indigo-100 ${watch(`friendList.${index}.roadNameAddress`) ? 'text-black' : 'text-gray-500'}`}
                    onClick={() => openAddressSearch(index)}
                  >
                    {watch(`friendList.${index}.roadNameAddress`) || '주소 입력'}
                  </div>
                  <input
                    type="hidden"
                    {...register(`friendList.${index}.roadNameAddress` as const, { required: true })}
                  />
                </div>
              </div>
            </div>
          ))}
        </form>
        <button
          type="button"
          onClick={() => append(default_format)}
          className="w-full font-semibold text-indigo-600 bg-indigo-100 rounded-lg min-h-10"
        >
          +
        </button>
        <Button isLoading={isLoading} text="중간 지점 찾기" onClick={handleSubmit(onSubmit)} />
      </div>
      <div className="w-[38%] rounded-xl h-[500px] -mt-8 shadow-lg">
        <KakaoMap coordinates={coordinates} />
      </div>
    </div>
  );
}
