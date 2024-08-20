import { useState } from 'react';
import ShareIcon from '@/assets/imgs/Location/sharepin.svg?react'; // 모달 상단의 아이콘을 추가
import Bulb from '@/assets/imgs/BannerMessage/Bulb.svg?react';
import Crayon from '@/assets/imgs/BannerMessage/Crayon.svg?react';
import MiniPin from '@/assets/imgs/BannerMessage/MiniPin.svg?react';
import MiniVote from '@/assets/imgs/BannerMessage/MiniVote.svg?react';
import MiniCalendar from '@/assets/imgs/BannerMessage/MiniCalendar.svg?react';
import { useMatch } from 'react-router-dom';

interface ModalProps {
  url: string;
  onClose: () => void;
  onCopy: () => void;
}

// HTTP 환경에서도 URL 복사 기능을 지원하는 함수
const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
};

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('복사 실패', err);
  }
  document.body.removeChild(textArea);
};

export default function BannerMessage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLoginUrl = useMatch('/page/login/:roomId');
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <>
      <div className="flex items-center justify-center gap-2 p-2 py-5 rounded-lg *:text-lg w-4/5 bg-[#EFF3FF]">
        {isLoginUrl && (
          <>
            <Bulb />
            <div className="relative">간편한 로그인으로 싱크스팟을 시작해보세요!</div>
          </>
        )}
        {isEnterAlone && (
          <>
            <Crayon />
            <div className="relative">상대방의 위치를 입력하고 중간 지점을 찾아보세요!</div>
          </>
        )}
        {isPlaceVoteCreateAlone || isPlaceVoteCreateEach ? (
          <>
            <>
              <MiniVote />
              <div className="relative">
                투표할 장소를 <span className="text-[#2F5FDD] font-semibold ">모두 골라주세요!</span>
              </div>
            </>
          </>
        ) : null}
        {isPlaceVoteAlone || isPlaceVoteEach ? (
          <>
            <>
              <MiniVote />
              <div className="relative">
                만나고 싶은 장소를 <span className="text-[#2F5FDD] font-semibold ">골라주세요</span>
              </div>
            </>
          </>
        ) : null}
        {isPlaceVoteResultAlone || isPlaceVoteResultEach || isTimeVoteResultAlone || isTimeVoteResultEach ? (
          <>
            <>
              <MiniVote />
              <div className="relative">
                <span className="text-[#2F5FDD] font-semibold ">투표 결과</span>를 확인하세요!
              </div>
            </>
          </>
        ) : null}
        {isTimeVoteCreateAlone || isTimeVoteCreateEach ? (
          <>
            <>
              <MiniVote />
              <div className="relative">
                투표를 생성할 날짜를 <span className="text-[#2F5FDD] font-semibold ">모두 골라주세요!</span>
              </div>
            </>
          </>
        ) : null}
        {isTimeVoteAlone || isTimeVoteEach ? (
          <>
            <>
              <MiniCalendar />
              <div className="relative">
                모임에{' '}
                <span className="text-[#2F5FDD] font-semibold ">
                  참석 가능한 날짜를 선택한 후, 참석 가능 시간을 기입
                </span>
                해주세요!
              </div>
            </>
          </>
        ) : null}
        {isEnterEach || isResultAlone || isResultEach || isRecommendAlone || isRecommendEach ? (
          <>
            <MiniPin />
            <div className="relative">
              상대방에게{' '}
              <span className="text-[#2F5FDD] font-semibold underline cursor-pointer" onClick={handleOpenModal}>
                싱크스팟 링크
              </span>
              를 공유해보세요!
            </div>
          </>
        ) : null}
      </div>
      {isModalOpen && (
        <Modal url={window.location.href} onClose={handleCloseModal} onCopy={handleCopyUrl} copied={copied} />
      )}
    </>
  );
}

const Modal: React.FC<ModalProps & { copied: boolean }> = ({ url, onClose, onCopy, copied }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[90]">
    <div className=" rounded-2xl p-8 w-[490px] h-[480px] flex flex-col items-center shadow-lg gap-3 bg-[#f8f8fb]">
      <div className="mt-4 size-14">
        <ShareIcon />
      </div>
      <h2 className="text-2xl font-semibold text-[#1A3C95]">친구들에게 링크 공유하기</h2>
      <p className="flex flex-col items-center text-[16px] text-[#526d93] mb-4">
        <span>링크를 공유하면 내가 입력한 위치에 대한</span>
        <span>중간 지점 찾기 결과를 공유할 수 있어요!</span>
      </p>
      <input
        type="text"
        readOnly
        value={url}
        className="w-full px-4 py-4 mb-4 text-xl text-[#15254d] underline font-light text-center bg-white border-none cursor-not-allowed h-14 rounded-2xl focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-col justify-center w-full gap-4 *:font-semibold">
        <button
          className="px-4 py-2 text-xl text-white bg-blue-500 h-14 rounded-2xl hover:bg-blue-400"
          onClick={onCopy}
        >
          {copied ? '링크가 복사되었습니다!' : '링크 복사하기'}
        </button>
        <button
          className="px-4 py-2 text-xl text-white bg-gray-300 h-14 rounded-2xl hover:bg-gray-400"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  </div>
);
