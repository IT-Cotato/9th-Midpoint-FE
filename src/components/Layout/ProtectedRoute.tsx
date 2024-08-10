import { fetchExistence } from '@/apis/existence';
import Loading from '@/pages/Loading/loading';
import NotFound from '@/pages/NotFound/not-found';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

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
}
