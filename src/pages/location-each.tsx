//import { useParams } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { loginAtom } from '@/stores/login-state';
import KakaoMap from '@/components/kakao-map';
import Login from '@/components/login';
import LocationEachForm from '@/components/location-each-form';

export default function LocationEach() {
  // const { roomId } = useParams<{ roomId: string }>();
  const isLogin = useAtomValue(loginAtom); // 로그인 여부 확인을 위한 변수

  // 유효하지 않은 방번호에 대한 접근인 경우 <NotFound/>컴포넌트를 return한다.

  // 장소 입력 방에 저장된 사람들의 정보 가져오기
  // const { data: usersData, isLoading: usersLoading } = useQuery({
  //   queryKey: ['placeRoomUsers', roomId],
  //   queryFn: () => fetchRoomUsersInfo(roomId!),
  // });

  const usersData = [
    {
      memberId: 1,
      username: '윤찬호',
      siDo: '서울특별시',
      siGunGu: '마포구',
      roadNameAddress: '서울 서대문구 봉원사2길 10-2',
      addressLat: 37.556328,
      addressLong: 126.923634,
      transport: 'public',
    },
    {
      memberId: 2,
      username: '신예진',
      siDo: '서울특별시',
      siGunGu: '강남구',
      roadNameAddress: '서울 서대문구 봉원사2길 10-4',
      addressLat: 37.499006,
      addressLong: 127.027629,
      transport: 'public',
    },
  ];

  const coordinatesList = usersData.map((user) => ({
    lat: user.addressLat,
    lng: user.addressLong,
  }));

  // if (usersLoading) {
  //   return <Loading />;
  // }

  return (
    <>
      <div className="flex justify-center w-full">
        <div className="flex flex-col w-full gap-3">
          {isLogin ? (
            <>
              <LocationEachForm />
              <div className="w-[38%] rounded-xl h-[500px] -mt-8 shadow-lg">
                <KakaoMap coordinates={coordinatesList} />
              </div>
            </>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </>
  );
}
