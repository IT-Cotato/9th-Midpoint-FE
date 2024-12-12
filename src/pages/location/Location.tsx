import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Parasol from '@/assets/imgs/Location/parasol.svg?react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { default_format, IForm, SubmissionData } from '@/types/Location';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance, BACKEND_URL } from '@/apis/index.api';
import {
  FROM_ALONE_CREATE_VOTE_PLACE,
  FROM_ALONE_CREATE_VOTE_TIME,
  FROM_ALONE_PLACE_VOTE,
  FROM_ALONE_PLACE_VOTE_RESULT,
  FROM_ALONE_TIME_VOTE,
  FROM_ALONE_TIME_VOTE_RESULT,
  FROM_ENTER_ALONE,
  ROOM_TYPE_ALONE,
} from '@/constants';
import Button from '@/components/common/button/Button';
import KakaoMap from '@/components/common/shared/kakao-map';
import { postPlace } from '@/apis/location.api';

export default function Location() {
  const location = useLocation();
  const from = location.state?.from;

  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // 중간지점찾기 로딩상태
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number }[]
  >([]); // 사용자들의 좌표 목록
  const [isAllFieldsFilled, setIsAllFieldsFilled] = useState(false);
  const { control, register, handleSubmit, setValue, watch } = useForm<IForm>({
    defaultValues: {
      friendList: [default_format],
    },
  });
  const { fields, append, remove, replace } = useFieldArray({
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

  // 중간지점찾기 API 요청
  const { mutate: searchMiddlePoint } = useMutation({
    mutationFn: (data: SubmissionData[]) => postPlace(data, roomId!),
    onSuccess: () => {
      switch (from) {
        case FROM_ALONE_CREATE_VOTE_PLACE:
          navigate(`/page/a/create/place-vote-room/${roomId}`);
          break;
        case FROM_ALONE_PLACE_VOTE:
          navigate(`/page/a/place-vote/${roomId}`);
          break;
        case FROM_ALONE_PLACE_VOTE_RESULT:
          navigate(`/page/a/place-vote/results/${roomId}`);
          break;
        case FROM_ALONE_CREATE_VOTE_TIME:
          navigate(`/page/a/create/time-vote-room/${roomId}`);
          break;
        case FROM_ALONE_TIME_VOTE:
          navigate(`/page/a/time-vote/${roomId}`);
          break;
        case FROM_ALONE_TIME_VOTE_RESULT:
          navigate(`/page/a/time-vote/results/${roomId}`);
          break;
        default:
          navigate(`/page/a/results/${roomId}`);
      }
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

    const submissionData: SubmissionData[] = data.friendList.map(
      ({ siDo, siGunGu, roadNameAddress, addressLat, addressLong }) => ({
        siDo,
        siGunGu,
        roadNameAddress,
        addressLat,
        addressLong,
      }),
    );

    console.log('중간지점 찾기 요청시 서버로 보내는 값', submissionData);

    searchMiddlePoint(submissionData);
  };

  // 친구 삭제 시 좌표 정보도 제거하는 함수
  const handleRemove = (index: number) => {
    remove(index);
    setCoordinates((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    async function handleEnterAlone() {
      try {
        const { data } = await axiosInstance.get(
          `${BACKEND_URL}/api/place-rooms/self`,
          {
            headers: {
              RoomId: roomId,
              RoomType: ROOM_TYPE_ALONE,
            },
          },
        );
        if (data.isSuccess && data.data.existence) {
          const places = data.data.places;
          if (places && places.length > 0) {
            const initialValues = places.map((item: any) => ({
              siDo: item.siDo,
              siGunGu: item.siGunGu,
              roadNameAddress: item.roadNameAddress,
              addressLat: item.addressLat,
              addressLong: item.addressLong,
            }));
            replace(initialValues);
            setCoordinates(
              places.map((item: any) => ({
                lat: item.addressLat,
                lng: item.addressLong,
              })),
            );
          }
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate(`/page/login/${roomId}`, {
            state: { from: FROM_ENTER_ALONE },
          });
        }
        if (error.response && error.response.status === 422) {
          navigate('/not-found');
        }
      }
    }
    handleEnterAlone();
  }, [replace, roomId, navigate]);

  // 모든 필드가 채워졌는지 확인하는 함수
  useEffect(() => {
    const subscription = watch((value) => {
      const friendList = value.friendList || [];
      const allFieldsFilled = friendList.every(
        (friend) =>
          friend &&
          friend.roadNameAddress &&
          friend.siDo &&
          friend.siGunGu &&
          friend.addressLat &&
          friend.addressLong,
      );
      setIsAllFieldsFilled(allFieldsFilled);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <div className="grid w-4/5 gap-3 grid-cols-2 grid-rows-[auto_1fr]">
        <div className="bg-[#F8F8FB] rounded-2xl shadow-lg flex flex-col justify-between gap-2 px-4 pt-10 row-span-2 py-2 h-[500px]">
          <div className="flex flex-col items-center gap-2">
            <Parasol />
            <h1 className="text-2xl font-semibold text-[#1A3C95]">
              모임 정보 입력
            </h1>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-grow gap-6 py-1 overflow-y-auto "
          >
            {fields.map((field, index) => (
              <div key={field.id}>
                <h2 className="flex items-center justify-between mb-2 text-lg font-semibold">
                  <span className="text-[#1A3C95] ml-2">친구 {index + 1} </span>
                  {fields.length > 1 && (
                    <XMarkIcon
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleRemove(index)}
                    />
                  )}
                </h2>
                <div className="relative w-full overflow-x-auto">
                  <div
                    className={`flex items-center min-w-full h-14 px-3 pl-4 bg-white w-max border-none rounded-2xl cursor-pointer ${
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
          <div className="flex flex-col gap-2 mb-2">
            <button
              type="button"
              onClick={() => append(default_format)}
              className="w-full rounded-2xl text-gray-500 primary-btn min-h-14 bg-[#ECECF3] hover:bg-gray-300"
            >
              + 친구 추가하기
            </button>
            <Button
              isLoading={isLoading}
              isMore={!isAllFieldsFilled}
              isMoreMessage="중간 지점 찾기"
              text="중간 지점 찾기"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
        <div className="h-[500px] shadow-lg rounded-2xl row-span-2">
          <KakaoMap coordinates={coordinates} />
        </div>
      </div>
    </>
  );
}
