import KakaoMap from '@/components/kakao-map';
import LocationEachForm from '@/components/location-each-form';

export default function LocationEach() {
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
      <div className="grid w-4/5 grid-cols-2 gap-3 grid-rows-[auto_1fr]">
        <div className="rounded-2xl bg-[#F8F8FB] row-span-1 px-2 py-2">
          <LocationEachForm />
        </div>
        <div className="rounded-2xl h-[500px] shadow-lg row-span-5">
          <KakaoMap coordinates={coordinatesList} />
        </div>
      </div>
    </>
  );
}
