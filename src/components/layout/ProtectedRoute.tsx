import { getRoomExistence } from '@/apis/existence.api';
import Loading from '@/pages/loading/Loading';
import NotFound from '@/pages/notFound/NotFound';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router-dom';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    data: exists,
    isLoading: isPending,
    isError,
  } = useQuery({
    queryKey: ['existence', roomId],
    queryFn: () => getRoomExistence(roomId!),
    enabled: !!roomId,
  });

  if (isPending) return <Loading />;
  if (isError) {
    return <NotFound />;
  }

  const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

  if (!isLoggedIn || !exists?.existence) {
    return <Navigate to="/page/login" replace />;
  }
  return children;
}
