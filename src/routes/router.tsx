import LocationAlone from '@/pages/Location/location-alone';
import NotFound from '@/pages/NotFound/not-found';
import Time from '@/pages/time';
import { createBrowserRouter } from 'react-router-dom';
import LocationEach from '@/pages/Location/location-each';
import Home from '@/pages/Home/home';
import Login from '@/pages/Login/login';
import MidpointAloneResult from '@/pages/MidpointResult/MidpointAloneResult';
import MidpointEachResult from '@/pages/MidpointResult/MidpointEachResult';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Layout from '@/components/Layout/Layout';
import RecommendEach from '@/pages/Recommend/RecommendEach';
import RecommendAlone from '@/pages/Recommend/RecommendAlone';

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
        element: <MidpointAloneResult />,
      },
      {
        path: 'e/results/:roomId',
        element: <MidpointEachResult />,
      },
      {
        path: 'a/results/:roomId/recommendations',
        element: <RecommendAlone />,
      },
      {
        path: 'e/results/:roomId/recommendations',
        element: <RecommendEach />,
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
