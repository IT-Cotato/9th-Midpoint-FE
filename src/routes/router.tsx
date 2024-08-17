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
import TimeVote from '@/pages/TimeVote/time-vote';
import RecommendEach from '@/pages/Recommend/RecommendEach';
import RecommendAlone from '@/pages/Recommend/RecommendAlone';
import TimeResult from '@/pages/TimeResult/time-result';

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
        path: 'a/time/:roomId',
        element: <Time />,
      },

      {
        path: 'e/time/:roomId',
        element: <Time />,
      },
      {
        path: 'a/time/vote/:roomId',
        element: <TimeVote />,
      },

      {
        path: 'e/time/vote/:roomId',
        element: <TimeVote />,
      },
      {
        path: 'a/time/results/:roomId',
        element: <TimeResult />,
      },

      {
        path: 'e/time/results/:roomId',
        element: <TimeResult />,
      },
    ],
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />,
  },
]);
