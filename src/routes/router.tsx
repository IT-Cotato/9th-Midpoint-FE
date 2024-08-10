import LocationAlone from '@/pages/Location/location-alone';
import NotFound from '@/pages/NotFound/not-found';
import Time from '@/pages/time';
import { createBrowserRouter } from 'react-router-dom';
import LocationEach from '@/pages/Location/location-each';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home/home';
import Layout from '@/components/common/shared/Layout';
import Login from '@/pages/Login/login';
import MidpointResult from '@/pages/MidpointResult/MidpointResult';

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
      {
        path: ':roomId/time',
        element: <Time />,
      },
    ],
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />,
  },
]);
