import { fetchExistence } from '@/apis/existence';
import Loading from '@/pages/loading';
import NotFound from '@/pages/not-found';
import { useQuery } from '@tanstack/react-query';
import { useMatch, useParams } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const enterEach = useMatch('/page/each/:roomId');
  const eachResult = useMatch('/page/e/results/:roomId');

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

  async function handleEnterEach() {}
  async function handleEachResult() {}

  // 각각어느경로인지 확인하고, 401 403 에러 처리해줄것 (아래 참고) -> 이때 useParams를 통해 roomId를 얻고 이를 사용할것 + axios사용할것, axiosInstance 놉
  // axiosInstance사용하면 401뜨면 at재요청 보내기때문

  if (enterEach) {
    handleEnterEach();
  }
  if (eachResult) {
    handleEachResult();
  }

  // 문제가 없을 시에만 children를 리턴하도록 문제있으면 null리턴
  return children;
}
