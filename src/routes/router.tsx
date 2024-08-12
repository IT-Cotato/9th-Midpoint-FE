import LocationAlone from '@/pages/Location/location-alone';
import NotFound from '@/pages/NotFound/not-found';
import Time from '@/pages/Time/time';
import { createBrowserRouter } from 'react-router-dom';
import LocationEach from '@/pages/Location/location-each';
import Home from '@/pages/Home/home';
import Login from '@/pages/Login/login';
import MidpointAloneResult from '@/pages/MidpointResult/MidpointAloneResult';
import MidpointEachResult from '@/pages/MidpointResult/MidpointEachResult';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import Layout from '@/components/Layout/Layout';
import TimeVote from '@/pages/Time/time-vote';

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
        path: ':roomId/time',
        element: <Time />,
      },
      {
        path: ':roomId/time/vote',
        element: <TimeVote />,
      },
    ],
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />,
  },
]);
