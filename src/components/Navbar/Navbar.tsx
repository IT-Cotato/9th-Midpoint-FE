import { getPlaceRoomExists, getTimeRoomExists } from '@/apis/existence.api';
// import { axiosInstance, BACKEND_URL } from '@/apis/index.api';
// import { postLogout } from '@/apis/login.api';
import { getPlaceVoted } from '@/apis/place-vote.api';
import { getTimeVoted } from '@/apis/time-vote.api';

import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';
import { QUERY_KEYS } from '@/constants';
import { loginAtom } from '@/stores/login-state';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';

export default function Navbar() {
  const { roomId } = useParams<string>();
  // 중간지점장소관련
  const isSync = useMatch('/page/syncspot/:roomId');
  const isSycnResult = useMatch('/page/a/results/:roomId');
  const isRecommend = useMatch('/page/a/results/:roomId/recommendations');

  // 장소투표관련
  const isPlaceCreate = useMatch('place/create/:roomId');
  const isPlaceVoteAlone = useMatch('place/vote/:roomId');
  const isPlaceResult = useMatch('place/results/:roomId');

  // 시간투표관련
  const isTimeCreate = useMatch('time/create/:roomId');
  const isTimeVoteAlone = useMatch('time/vote/:roomId');
  const isTimeResult = useMatch('time/results/:roomId');

  // 중간지점페이지관련
  const isSyncspot = isSync || isSycnResult || isRecommend;

  // 장소투표관련
  const isPlaceVote = isPlaceCreate || isPlaceVoteAlone || isPlaceResult;

  // 시간투표관련
  const isTimeVote = isTimeCreate || isTimeVoteAlone || isTimeResult;

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const [isMidpointDropdownOpen, setMidpointIsDropdownOpen] = useState(false);
  const [isPlaceVoteDropdownOpen, setPlaceVoteDropdownOpen] = useState(false);
  const [isTimeVoteDropdownOpen, setTimeVoteDropdownOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLogin(false);
    // try {
    //   return axiosInstance.post(BACKEND_URL + '/api/members/logout');
    // } catch (err) {
    //   console.log('logout 에러');
    // } finally {
    //   navigate('/');
    // }
    //로그아웃
    // const { data: islogout } = useQuery({
    //   queryKey: ['LOGOUT',i],
    //   queryFn: () => postLogout(),
    // });
  }

  // 장소투표방 존재여부 확인 (장소투표방 생성시 또는 장소투표하기링크 진입시 useffect안 또는 장소투표결과 useEffect안 revalidate)
  const { data: placeVoteData } = useQuery({
    queryKey: [QUERY_KEYS.IS_EXISTS_PLACEVOTE_ROOM, roomId],
    queryFn: () => getPlaceRoomExists(roomId!),
    enabled: !!roomId,
  });

  // 장소투표여부 확인 (장소투표시 revalidate)
  const { data: isPlaceVoted } = useQuery({
    queryKey: [QUERY_KEYS.IS_VOTED, roomId],
    queryFn: () => getPlaceVoted(roomId!),
    enabled: !!roomId,
  });

  // 시간투표방 존재여부 확인
  const { data: timeVoteData } = useQuery({
    queryKey: [QUERY_KEYS.IS_EXISTS_TIMEVOTE_ROOM, roomId],
    queryFn: () => getTimeRoomExists(roomId!),
    enabled: !!roomId,
  });

  // 시간투표여부 확인
  const { data: isTimeVoted } = useQuery({
    queryKey: [QUERY_KEYS.IS_VOTED, roomId],
    queryFn: () => getTimeVoted({ roomId: roomId! }),
    enabled: !!roomId,
  });

  return (
    <header className="w-4/5">
      <nav className="flex items-center justify-between">
        <ul>
          <Link to="/" className="flex items-center gap-2">
            <MainLogo />
            <span className="text-3xl font-semibold">syncspot</span>
          </Link>
        </ul>
        <ul className="flex items-center gap-6 *:cursor-pointer *:transition-colors">
          <li
            onMouseEnter={() => setMidpointIsDropdownOpen(true)}
            onMouseLeave={() => setMidpointIsDropdownOpen(false)}
            className="relative"
          >
            <h1
              className={
                Boolean(isSyncspot)
                  ? 'text-blue-600 text-[17px]'
                  : 'text-black text-[17px] font-light'
              }
            >
              중간 지점 찾기
            </h1>
            {isMidpointDropdownOpen && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-md -left-4 top-full *:text-[15px] p-2">
                <li
                  className="px-4 py-2 font-light transition-colors cursor-pointer hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100 hover:font-normal"
                  onClick={() => navigate(`/page/syncspot/${roomId}`)}
                >
                  장소 입력하기
                </li>
                <li
                  className="px-4 py-2 font-light text-center transition-colors cursor-pointer hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100 hover:font-normal"
                  onClick={() => navigate(`/page/syncspot/results/${roomId}`)}
                >
                  결과 보기
                </li>
              </ul>
            )}
          </li>
          <li
            onMouseEnter={() => setPlaceVoteDropdownOpen(true)}
            onMouseLeave={() => setPlaceVoteDropdownOpen(false)}
            className="relative"
          >
            <h1
              className={
                isPlaceVote
                  ? 'text-blue-600 text-[17px]'
                  : 'text-black text-[17px] font-light'
              }
            >
              장소 투표
            </h1>
            {isPlaceVoteDropdownOpen && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-md -left-9 top-full p-2 *:text-[15px]">
                <li
                  className="px-4 py-2 font-light transition-colors cursor-pointer hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100 hover:font-normal"
                  onClick={() => navigate(`/page/place/create/${roomId}`)}
                >
                  {!placeVoteData?.existence
                    ? '투표 생성하기'
                    : '투표 재생성하기'}
                </li>
                {placeVoteData?.existence && (
                  <li
                    className="px-4 py-2 font-light text-center transition-colors cursor-pointer hover:font-normal hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100"
                    onClick={() => navigate(`/pate/place/vote/${roomId}`)}
                  >
                    {!isPlaceVoted?.existence ? '투표하기' : '재투표하기'}
                  </li>
                )}
              </ul>
            )}
          </li>
          <li
            onMouseEnter={() => setTimeVoteDropdownOpen(true)}
            onMouseLeave={() => setTimeVoteDropdownOpen(false)}
            className="relative"
          >
            <h1
              className={
                isTimeVote
                  ? 'text-blue-600 text-[17px]'
                  : 'text-black text-[17px] font-light'
              }
            >
              시간 투표
            </h1>
            {isTimeVoteDropdownOpen && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-md p-2 -left-9 top-full *:text-[15px]">
                <li
                  className="px-4 py-2 font-light transition-colors cursor-pointer hover:font-normal hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100"
                  onClick={() => navigate(`/page/time/create/${roomId}`)}
                >
                  {!timeVoteData?.existence
                    ? '투표 생성하기'
                    : '투표 재생성하기'}
                </li>
                {timeVoteData?.existence && (
                  <li
                    className="px-4 py-2 font-light text-center transition-colors cursor-pointer hover:font-normal hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100"
                    onClick={() => navigate(`/page/time/vote/${roomId}`)}
                  >
                    {!isTimeVoted?.myVotesExistence ? '투표하기' : '재투표하기'}
                  </li>
                )}
              </ul>
            )}
          </li>
          <li
            onMouseEnter={() => setTimeVoteDropdownOpen(true)}
            onMouseLeave={() => setTimeVoteDropdownOpen(false)}
            className="relative"
          >
            <h1
              className={
                isTimeVote
                  ? 'text-blue-600 text-[17px]'
                  : 'text-black text-[17px] font-light'
              }
              onClick={() => navigate('/page/aboutus')}
            >
              서비스 소개
            </h1>
          </li>
          {isLogin ? (
            <li onClick={handleLogout}>
              <ArrowRightStartOnRectangleIcon className="size-5" />
            </li>
          ) : (
            <li onClick={() => navigate('/page/login')}>
              <div className="rounded-full border-primary-600 size-5">
                로그인
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
