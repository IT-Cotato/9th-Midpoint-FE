import NotFound from '@/pages/notFound/NotFound';
import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HomeRe from '@/pages/home/Home';
import Location from '@/pages/location/Location';
import LocationResult from '@/pages/location/LocationResult';
import Recommend from '@/pages/location/Recommend';
import PlaceCreate from '@/pages/placeVote/PlaceCreate';
import PlaceVote from '@/pages/placeVote/PlaceVote';
import PlaceResult from '@/pages/placeVote/PlaceResult';
import TimeCreate from '@/pages/timeVote/TimeCreate';
import TimeVote from '@/pages/timeVote/TimeVote';
import TimeResult from '@/pages/timeVote/TimeResult';
import AboutUs from '@/pages/home/AboutUs';
import Signup from '@/pages/my/Signup';
import RoomList from '@/pages/my/RoomList';
import RoomDetail from '@/pages/my/RoomDetail';
import RoomCreate from '@/pages/my/RoomCreate';
import Login from '@/pages/my/Login';
import FindUser from '@/pages/my/FindUser';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRe />,
  },
  {
    path: '/page',
    element: <Layout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'find-user',
        element: <FindUser />,
      },
      {
        //방리스트
        path: 'room-list',
        element: <RoomList />,
      },
      {
        //방 생성
        path: 'room/create',
        element: <RoomCreate />,
      },
      {
        //방 상세 정보
        path: 'room-list/:roomId',
        element: <RoomDetail />,
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
      {
        //서비스 소개
        path: '/page/aboutus',
        element: <AboutUs />,
      },
    ],
  },
  {
    path: '*', // 모든 경로에 부합하지 않는 경우
    element: <NotFound />,
  },
]);
