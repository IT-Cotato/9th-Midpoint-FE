import NotFound from '@/pages/NotFound/not-found';
import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/Login/login';
import Layout from '@/components/Layout/Layout';
import HomeRe from '@/pages/Home/homeRe';
import Location from '@/pages/Location/Location';
import LocationResult from '@/pages/Location/LocationResult';
import Recommend from '@/pages/Location/Recommend';
import PlaceCreate from '@/pages/PlaceVote/PlaceCreate';
import PlaceVote from '@/pages/PlaceVote/PlaceVote';
import PlaceResult from '@/pages/PlaceVote/PlaceResult';
import TimeCreate from '@/pages/TimeVote/TimeCreate';
import TimeVote from '@/pages/TimeVote/TimeVote';
import TimeResult from '@/pages/TimeVote/TimeResult';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRe />,
  },
  {
    path: '/page',
    element: (
      <Layout />
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Login />,
      },
      {
        //방리스트
        path: 'room-list',
        element: <Login />,
      },
      {
        //방 상세 정보
        path: 'room-list/:roomId',
        element: <Login />,
      },
      {
        //중간지점 입력
        path: 'syncspot/:roomId',
        element: <Location />,
      },
      {
        //중간지점 결과
        path: 'syncspot/results/:roomId',
        element: <LocationResult />,
      },
      {
        //주변 장소 추천
        path: 'syncspot/results/:roomId/recommendations',
        element: <Recommend />,
      },
      {
        //장소투표 생성
        path: 'place/create/:roomId',
        element: <PlaceCreate />,
      },
      {
        //장소투표
        path: 'place/vote/:roomId',
        element: <PlaceVote />,
      },
      {
        //장소투표 결과
        path: 'place/results/:roomId',
        element: <PlaceResult />,
      },
      {
        //시간투표 생성
        path: 'time/create/:roomId',
        element: <TimeCreate />,
      },
      {
        //시간투표
        path: 'time/vote/:roomId',
        element: <TimeVote />,
      },
      {
        //시간투표 결과
        path: 'time/results/:roomId',
        element: <TimeResult />,
      },
    ],
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />,
  },
]);
