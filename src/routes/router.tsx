import Home from '@/pages/home';
import Midpoint from '@/pages/midpoint';
import Vote from '@/pages/vote';
import Time from '@/pages/time';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/midpoint',
    element: <Midpoint />,
  },
  {
    path: '/vote',
    element: <Vote />,
  },
  {
    path: '/time',
    element: <Time />,
  },
]);
