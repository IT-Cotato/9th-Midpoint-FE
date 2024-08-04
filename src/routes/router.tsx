import Home from '@/pages/home';
import LocationAlone from '@/pages/location-alone';
import NotFound from '@/pages/not-found';
import Vote from '@/pages/vote';
import Time from '@/pages/time';
import { createBrowserRouter } from 'react-router-dom';
import LocationEach from '@/pages/location-each';
import MidpointResult from '@/components/MidpointResult';
import Login from '@/components/login';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/page',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'login/:roomId',
        element: <Login />,
      },
      {
        path: 'alone/:roomId',
        element: <LocationAlone />,
      },
      {
        path: 'each/:roomId',
        element: <LocationEach />,
      },
      {
        path: 'a/results/:roomId',
        element: <MidpointResult />,
      },
      {
        path: 'e/results/:roomId',
        element: <MidpointResult />,
      },
    ],
  },
  {
    path: '/vote',
    element: <Vote />,
  },
  {
    path: '/time',
    element: <Time />,
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />,
  },
]);
