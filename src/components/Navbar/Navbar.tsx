import { axiosInstance, BACKEND_URL } from '@/apis';
import { fetchPlaceRoomExists, fetchVoted } from '@/apis/placeVoteRoom';
import { fetchTimeRoomExists, fetchTimeVoted } from '@/apis/timeVoteRoom';
import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';
import { ROOM_TYPE_ALONE, ROOM_TYPE_EACH } from '@/constants';
import { loginAtom } from '@/stores/login-state';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { useQuery } from '@tanstack/react-query';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { Link, useMatch, useNavigate, useParams } from 'react-router-dom';

export default function Navbar() {
  const { roomId } = useParams<string>();
  // 중간지점장소관련
  const isEnterAlone = useMatch('/page/alone/:roomId');
  const isEnterEach = useMatch('/page/each/:roomId');
  const isResultAlone = useMatch('/page/a/results/:roomId');
  const isResultEach = useMatch('/page/e/results/:roomId');
  const isRecommendAlone = useMatch('/page/a/results/:roomId/recommendations');
  const isRecommendEach = useMatch('/page/e/results/:roomId/recommendations');

  // 장소투표관련
  const isPlaceVoteCreateAlone = useMatch('/page/a/create/place-vote-room/:roomId');
  const isPlaceVoteCreateEach = useMatch('/page/e/create/place-vote-room/:roomId');
  const isPlaceVoteAlone = useMatch('/page/a/place-vote/:roomId');
  const isPlaceVoteEach = useMatch('/page/e/place-vote/:roomId');
  const isPlaceVoteResultAlone = useMatch('/page/a/place-vote/results/:roomId');
  const isPlaceVoteResultEach = useMatch('/page/e/place-vote/results/:roomId');

  // 시간투표관련
  const isTimeVoteCreateAlone = useMatch('/page/a/create/time-vote-room/:roomId');
  const isTimeVoteCreateEach = useMatch('/page/e/create/time-vote-room/:roomId');
  const isTimeVoteAlone = useMatch('/page/a/time-vote/:roomId');
  const isTimeVoteEach = useMatch('/page/e/time-vote/:roomId');
  const isTimeVoteResultAlone = useMatch('/page/a/time-vote/results/:roomId');
  const isTimeVoteResultEach = useMatch('/page/e/time-vote/results/:roomId');

  // 개인관련
  const isAlone =
    isEnterAlone ||
    isResultAlone ||
    isRecommendAlone ||
    isPlaceVoteCreateAlone ||
    isPlaceVoteAlone ||
    isPlaceVoteResultAlone ||
    isTimeVoteCreateAlone ||
    isTimeVoteAlone ||
    isTimeVoteResultAlone;

  // 개개인 관련
  const isEach =
    isEnterEach ||
    isResultEach ||
    isRecommendEach ||
    isPlaceVoteCreateEach ||
    isPlaceVoteEach ||
    isPlaceVoteResultEach ||
    isTimeVoteCreateEach ||
    isTimeVoteEach ||
    isTimeVoteResultEach;

  // 중간지점페이지관련
  const isMidpoint =
    isEnterAlone || isEnterEach || isResultAlone || isResultEach || isRecommendAlone || isRecommendEach;

  // 장소투표관련
  const isPlaceVote =
    isPlaceVoteCreateAlone ||
    isPlaceVoteCreateEach ||
    isPlaceVoteAlone ||
    isPlaceVoteEach ||
    isPlaceVoteResultAlone ||
    isPlaceVoteResultEach;

  // 시간투표관련
  const isTimeVote =
    isTimeVoteCreateAlone ||
    isTimeVoteCreateEach ||
    isTimeVoteAlone ||
    isTimeVoteEach ||
    isTimeVoteResultAlone ||
    isTimeVoteResultEach;

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useAtom(loginAtom);
  const [isMidpointDropdownOpen, setMidpointIsDropdownOpen] = useState(false);
  const [isPlaceVoteDropdownOpen, setPlaceVoteDropdownOpen] = useState(false);
  const [isTimeVoteDropdownOpen, setTimeVoteDropdownOpen] = useState(false);

  function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roomId');
    setIsLogin(false);
    try {
      return axiosInstance.post(BACKEND_URL + '/api/members/logout');
    } catch (err) {
      console.log('logout 에러');
    } finally {
      navigate('/');
    }
  }

  // 장소투표방 존재여부 확인 (장소투표방 생성시 또는 장소투표하기링크 진입시 useffect안 또는 장소투표결과 useEffect안 revalidate)
  const { data: placeVoteData } = useQuery({
    queryKey: ['placeVoteRoomExists', roomId],
    queryFn: () => fetchPlaceRoomExists(roomId!, isAlone ? ROOM_TYPE_ALONE : isEach ? ROOM_TYPE_EACH : ''),
  });

  // 장소투표여부 확인 (장소투표시 revalidate)
  const { data: isPlaceVoted } = useQuery({
    queryKey: ['isPlaceVoted', roomId],
    queryFn: () => fetchVoted(roomId!, isAlone ? ROOM_TYPE_ALONE : isEach ? ROOM_TYPE_EACH : ''),
  });

  // 시간투표방 존재여부 확인
  const { data: timeVoteData } = useQuery({
    queryKey: ['timeVoteRoomExists', roomId],
    queryFn: () => fetchTimeRoomExists(roomId!, isAlone ? ROOM_TYPE_ALONE : isEach ? ROOM_TYPE_EACH : ''),
  });

  // 시간투표여부 확인
  const { data: isTimeVoted } = useQuery({
    queryKey: ['isTimeVoted', roomId],
    queryFn: () => fetchTimeVoted(roomId!, isAlone ? ROOM_TYPE_ALONE : isEach ? ROOM_TYPE_EACH : ''),
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
          <li onClick={() => navigate('/')} className="text-[17px] font-light">
            홈
          </li>
          <li
            onMouseEnter={() => setMidpointIsDropdownOpen(true)}
            onMouseLeave={() => setMidpointIsDropdownOpen(false)}
            className="relative"
          >
            <h1 className={Boolean(isMidpoint) ? 'text-blue-600 text-[17px]' : 'text-black text-[17px] font-light'}>
              중간 지점 찾기
            </h1>
            {isMidpointDropdownOpen && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-md -left-4 top-full *:text-[15px] p-2">
                <li
                  className="px-4 py-2 font-light transition-colors cursor-pointer hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100 hover:font-normal"
                  onClick={() =>
                    isAlone
                      ? navigate(`/page/alone/${roomId}`)
                      : isEach
                        ? navigate(`/page/each/${roomId}`)
                        : navigate('/')
                  }
                >
                  장소 입력하기
                </li>
                <li
                  className="px-4 py-2 font-light text-center transition-colors cursor-pointer hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100 hover:font-normal"
                  onClick={() =>
                    isAlone
                      ? navigate(`/page/a/results/${roomId}`)
                      : isEach
                        ? navigate(`/page/e/results/${roomId}`)
                        : navigate('/')
                  }
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
            <h1 className={isPlaceVote ? 'text-blue-600 text-[17px]' : 'text-black text-[17px] font-light'}>
              장소 투표
            </h1>
            {isPlaceVoteDropdownOpen && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-md -left-10 top-full p-2 *:text-[15px]">
                <li
                  className="px-4 py-2 font-light transition-colors cursor-pointer hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100 hover:font-normal"
                  onClick={() =>
                    isAlone
                      ? navigate(`/page/a/create/place-vote-room/${roomId}`)
                      : isEach
                        ? navigate(`/page/e/create/place-vote-room/${roomId}`)
                        : navigate('/')
                  }
                >
                  {!placeVoteData?.existence ? '투표 생성하기' : '투표 재생성하기'}
                </li>
                {placeVoteData?.existence && (
                  <li
                    className="px-4 py-2 font-light text-center transition-colors cursor-pointer hover:font-normal hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100"
                    onClick={() =>
                      isAlone
                        ? navigate(`/page/a/place-vote/${roomId}`)
                        : isEach
                          ? navigate(`/page/e/place-vote/${roomId}`)
                          : navigate('/')
                    }
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
            <h1 className={isTimeVote ? 'text-blue-600 text-[17px]' : 'text-black text-[17px] font-light'}>
              시간 투표
            </h1>
            {isTimeVoteDropdownOpen && (
              <ul className="absolute z-50 bg-white border border-gray-200 rounded-2xl shadow-md p-2 -left-10 top-full *:text-[15px]">
                <li
                  className="px-4 py-2 font-light transition-colors cursor-pointer hover:font-normal hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100"
                  onClick={() =>
                    isAlone
                      ? navigate(`/page/a/create/time-vote-room/${roomId}`)
                      : isEach
                        ? navigate(`/page/e/create/time-vote-room/${roomId}`)
                        : navigate('/')
                  }
                >
                  {!timeVoteData?.existence ? '투표 생성하기' : '투표 재생성하기'}
                </li>
                {timeVoteData?.existence && (
                  <li
                    className="px-4 py-2 font-light text-center transition-colors cursor-pointer hover:font-normal hover:text-blue-600 whitespace-nowrap hover:opacity-90 hover:bg-gray-100"
                    onClick={() =>
                      isAlone
                        ? navigate(`/page/a/time-vote/${roomId}`)
                        : isEach
                          ? navigate(`/page/e/time-vote/${roomId}`)
                          : navigate('/')
                    }
                  >
                    {!isTimeVoted?.myVotesExistence ? '투표하기' : '재투표하기'}
                  </li>
                )}
              </ul>
            )}
          </li>
          {isLogin && (
            <li onClick={handleLogout}>
              <ArrowRightStartOnRectangleIcon className="size-5" />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
