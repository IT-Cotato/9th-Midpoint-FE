import EnterLocation from '@/pages/enter-location';
import Home from '@/pages/home';
import LocationAlone from '@/pages/location-alone';
import LocationEach from '@/pages/location-each';
import NotFound from '@/pages/not-found';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/enter-location',
    element: <EnterLocation />,
    children: [
      {
        path: '',
        element: <LocationAlone />,
      },
      {
        path: ':roomId',
        element: <LocationEach />,
      },
    ],
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />, // NotFound 컴포넌트 렌더링
  },
]);
