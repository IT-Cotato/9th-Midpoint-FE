import { fetchExistence } from '@/apis/existence';
import Loading from '@/pages/loading';
import NotFound from '@/pages/not-found';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams<{ roomId: string }>();

  const {
    data: exists,
    isLoading: isPending,
    isError,
  } = useQuery({
    queryKey: ['existence', roomId],
    queryFn: () => fetchExistence(roomId!),
    enabled: !!roomId,
  });

  if (isPending) return <Loading />;
  if (isError || !exists?.existence || !Boolean(roomId)) return <NotFound />;

  return children;

  // 각각어느경로인지 확인하고, 401 403 에러 처리해줄것 (아래 참고) -> 이때 useParams를 통해 roomId를 얻고 이를 사용할것 + axios사용할것, axiosInstance 놉

  //   try {
  //     const { data } = await axios.post(BACKEND_URL + '/api/rooms');
  //     const newRoomId = data.data.id;
  //     navigate(`/page/alone/${newRoomId}`);
  //   } catch (error: any) {
  //     if (error.response && error.response.status === 401) {
  //       if (roomId) {
  //         console.log('here!');
  //         navigate(`/page/alone/${roomId}`);
  //       }
  //     } else if (error.response && error.response.status === 403) {
  //     } else {
  //       console.log('에러아님 무튼 아님');
  //       console.error('Error fetching data:', error);
  //     }
  //   }

  return <Navigate to="/login" />;
}
