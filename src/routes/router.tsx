import Home from '@/pages/home';
import LocationAlone from '@/pages/location-alone';
import NotFound from '@/pages/not-found';
import Vote from '@/pages/vote';
import Time from '@/pages/time';
import { createBrowserRouter } from 'react-router-dom';
import LocationEach from '@/pages/location-each';
import Layout from '@/pages/Layout';
import MidpointResult from '@/components/MidpointResult';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/page',
    element: <Layout />,
    children: [
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
    element: <NotFound />, // NotFound 컴포넌트 렌더링
  },
]);
