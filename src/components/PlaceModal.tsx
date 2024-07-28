import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FriendLogo from '@/assets/imgs/Home/friend.svg?react';
import AloneLogo from '@/assets/imgs/Home/alone.svg?react';
import VoteLogo from '@/assets/imgs/Home/vote.svg?react';
import SharePin from '@/assets/imgs/Location/sharepin.svg?react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { BACKEND_URL } from '@/apis';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaceModal({ isOpen, onClose }: ModalProps) {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('options');
  const [roomId, setRoomId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  function handleCloseModal() {
    onClose();
    setSelectedOption(null);
    setCurrentView('options');
  }

  async function handleNextBtn() {
    if (selectedOption === 'friend') {
      setCurrentView('shareLink');
      const { data } = await axios.post(BACKEND_URL + '/api/rooms');
      setRoomId(data.data.id);
    } else {
      const { data } = await axios.post(BACKEND_URL + '/api/rooms');
      setRoomId(data.data.id);
      try {
        const { data, status } = await axios.get(BACKEND_URL + '/api/midpoints');

        console.log('백에서 준 data', data);
        console.log('백에서준 상태', status);
        // 선택한 것에 따라 결과화면으로 이동되도록 요청하는 url필요
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // 내가 개인 또는 개개인을 선택했는지에 따라 다른 url로 요청한다.
          if (selectedOption === 'alone') {
            navigate('/page/alone/123'); // 위에서 방을 생성하고 얻은 방 id값을 넣는다. (이거 로그인 url을 따로 만들어서 로그인 페이지로 가도록 수정 필요/page/login)
          }
        } else if (error.response && error.response.status === 403) {
        } else {
          console.log('에러아님 무튼 아님');
          console.error('Error fetching data:', error);
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        className="relative p-8 bg-white rounded-lg shadow-lg w-[490px] h-[500px] flex flex-col items-center gap-2 border-2 border-black"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, transition: { type: 'tween' } }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <button className="absolute text-gray-500 top-2 right-2" onClick={handleCloseModal}>
          <XMarkIcon className="size-7" />
        </button>
        <AnimatePresence initial={false}>
          {currentView === 'options' && (
            <motion.div className="flex flex-col items-center w-full gap-2">
              <VoteLogo className="size-9" />
              <h2 className="mb-4 text-xl font-semibold text-[#1A3C95]">어떤 방법으로 장소를 결정할까요?</h2>
              <h2 className="mb-4 text-gray-500">편한 방식으로 모임 장소를 결정할 수 있어요!</h2>
              <div className="flex w-full gap-2 mt-4">
                <motion.div
                  className={`flex flex-col items-center  p-2 border rounded-lg cursor-pointer w-1/2 ${
                    selectedOption === 'alone' ? 'ring-4 ring-blue-400' : 'border-gray-300'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOptionClick('alone')}
                >
                  <span className="text-gray-500">친구들의 위치를</span>
                  <span className="text-gray-500">모두 알고 있다면?</span>
                  <AloneLogo className="my-3 size-16" />
                  <p className="font-semibold text-[#1A3C95] text-xl">내가 모두 입력하기</p>
                </motion.div>
                <motion.div
                  className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer w-1/2 ${
                    selectedOption === 'friend' ? 'ring-4 ring-blue-400' : 'border-gray-300'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleOptionClick('friend')}
                >
                  <span className="text-gray-500">친구들과 함께</span>
                  <span className="text-gray-500">장소를 결정하려면?</span>
                  <FriendLogo className="my-3 size-16" />
                  <p className="font-semibold text-[#1A3C95] text-xl">친구에게 공유하기</p>
                </motion.div>
              </div>
              <button
                className={`absolute bottom-5 w-[90%] py-2 rounded-lg text-white ${
                  selectedOption ? 'bg-blue-500 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'
                }`}
                onClick={handleNextBtn}
                disabled={!selectedOption}
              >
                다음
              </button>
            </motion.div>
          )}
          {currentView === 'shareLink' && (
            <motion.div className="flex flex-col items-center w-full gap-2">
              <SharePin className="mb-4 size-12" />
              <h2 className="mb-4 text-xl font-semibold text-[#1A3C95]">친구들에게 링크 공유하기</h2>
              <p className="flex flex-col gap-1 mb-4 text-gray-500">
                <span>링크를 공유하면 각자 위치를 입력한 후</span>
                <span>투표를 통해 중간 지점을 결정할 수 있어요!</span>
              </p>
              <input
                type="text"
                readOnly
                value={`https://cotato-midpoint.site/page/e/results/${roomId}`}
                className="w-full px-4 py-2 mb-16 text-center bg-gray-300 border rounded-lg cursor-not-allowed"
              />
              <button
                className="w-full py-2 mb-1 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-400 min-h-10"
                onClick={() => navigate(`/page/e/results/${roomId}`)}
              >
                링크 이동하기
              </button>
              <button
                className="w-full py-2 text-gray-500 transition-colors bg-gray-300 rounded-lg min-h-10 hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                닫기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
