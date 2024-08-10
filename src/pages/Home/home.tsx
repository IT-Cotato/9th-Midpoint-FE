import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MiniHome from '@/assets/imgs/Home/home.svg?react';
import MiniPin from '@/assets/imgs/Home/pin.svg?react';
import MiniVote from '@/assets/imgs/Home/smallvote.svg?react';
import MiniClock from '@/assets/imgs/Home/clock.svg?react';
import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';
import WAvatar from '@/assets/imgs/Home/w_avatar.png';
import MidpointLogo from '@/assets/imgs/Home/midpointLogo.png';
import VoteLogo from '@/assets/imgs/Home/voteLogo.png';
import TimeLogo from '@/assets/imgs/Home/timeLogo.png';
import PlaceModal from '@/components/Modal/PlaceModal';

interface DotProps {
  num: number;
  currentPage: number;
  onClick: (page: number) => void;
  isFirstSection: boolean;
}

interface DotsProps {
  currentPage: number;
  onDotClick: (page: number) => void;
}

function Dot({ num, currentPage, onClick, isFirstSection }: DotProps) {
  const isActive = currentPage === num;
  const activeColor = isFirstSection ? '#5786FF' : '#FFFFFF';
  const inactiveBorderColor = isFirstSection ? '#5786FF' : '#FFFFFF';

  return (
    <div
      onClick={() => onClick(num)}
      className={`w-4 h-4 border-2 rounded-full cursor-pointer transition-all duration-500 ${
        isActive ? `bg-[${activeColor}] border-[${activeColor}]` : `border-[${inactiveBorderColor}]`
      }`}
      style={{
        backgroundColor: isActive ? activeColor : 'transparent',
        borderColor: inactiveBorderColor,
      }}
    ></div>
  );
}

function Dots({ currentPage, onDotClick }: DotsProps) {
  const isFirstSection = currentPage === 1;
  return (
    <div className="fixed z-50 flex flex-col items-center justify-between space-y-4 transform -translate-y-1/2 top-1/2 right-24">
      <Dot num={1} currentPage={currentPage} onClick={onDotClick} isFirstSection={isFirstSection} />
      <Dot num={2} currentPage={currentPage} onClick={onDotClick} isFirstSection={isFirstSection} />
      <Dot num={3} currentPage={currentPage} onClick={onDotClick} isFirstSection={isFirstSection} />
    </div>
  );
}

export default function Home() {
  const outerDivRef = useRef<HTMLDivElement>(null);
  const thirdSectionRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    function handleScroll(e: WheelEvent) {
      if (isScrolling) return;

      setIsScrolling(true);

      e.preventDefault();
      const { deltaY } = e;

      if (deltaY > 0) {
        if (currentPage < 3) {
          setCurrentPage((prev) => Math.min(prev + 1, 3));
        }
      } else {
        if (currentPage > 1) {
          setCurrentPage((prev) => Math.max(prev - 1, 1));
        }
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent?.addEventListener('wheel', handleScroll);

    return () => {
      outerDivRefCurrent?.removeEventListener('wheel', handleScroll);
    };
  }, [isScrolling, currentPage]);

  useEffect(() => {
    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: (currentPage - 1) * window.innerHeight,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  const handleDotClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleIconClick = () => {
    setCurrentPage(3);
    thirdSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const avatars = [
    { name: '이솔', role: 'PM', description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당' },
    { name: '김기림', role: 'PM', description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당' },
    { name: '조연수', role: 'DE', description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당' },
    {
      name: '김태윤',
      role: 'FE-LEAD',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
    { name: '채다희', role: 'FE', description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당' },
    {
      name: '윤찬호',
      role: 'BE-LEAD',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
    { name: '신예진', role: 'BE', description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const sectionItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 2 } },
    exit: { opacity: 0 },
  };

  return (
    <div ref={outerDivRef} className="outer h-screen overflow-y-auto bg-[#5786FF] overflow-x-hidden">
      <Dots currentPage={currentPage} onDotClick={handleDotClick} />
      <section className="flex flex-col items-center h-[calc(100vh-80px)] m-10 bg-white rounded-xl min-w-[1024px] relative">
        <div className="flex items-center gap-3 py-8">
          <MainLogo />
          <h1 className="text-5xl font-semibold text-[#253E7F]">syncspot</h1>
        </div>
        <div className="relative flex items-center justify-around w-2/5 p-4 bg-[#5786FF] rounded-full">
          <div className="relative">
            <MiniHome className="cursor-pointer size-11" onClick={handleIconClick} />
          </div>
          <div className="relative">
            <MiniPin className="cursor-pointer size-11" onClick={handleIconClick} />
          </div>
          <div className="relative">
            <MiniVote className="cursor-pointer size-11" onClick={handleIconClick} />
          </div>
          <div className="relative">
            <MiniClock className="cursor-pointer size-11" onClick={handleIconClick} />
          </div>
        </div>
        <p className="absolute flex flex-col gap-3 text-2xl font-semibold bottom-8 left-8">
          <span>모두가 편안한 만남을 위해</span>
          <span>중간 지점을 찾아주는 '모두의 중간'</span>
        </p>
      </section>
      <section className="h-screen min-w-[1024px]">
        <AnimatePresence>
          {currentPage === 2 && (
            <motion.div
              className="relative flex flex-col items-center justify-center w-full h-full px-32"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="absolute left-24 top-12"
                initial={{ opacity: 0, x: -1500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 1500 }}
                transition={{ duration: 2, type: 'spring' }}
              >
                <h2 className="mb-8 text-4xl font-bold text-white">ABOUT US</h2>
                <p className="flex flex-col gap-2 text-xl text-white">
                  <span>IT 연합동아리 코테이토를 아시나요?</span>
                  <span>
                    팀 'ASAP'은 코테이토에서 만난 9명이 모여 모두가 편안한 만남을 가질 수 있는 서비스를 위해 결성된
                    팀이에요!
                  </span>
                </p>
              </motion.div>
              <div className="*:text-black mt-40 bg-white rounded-xl p-10 py-14  min-w-[1024px] mx-auto shadow-xl">
                <div className="grid grid-cols-3 gap-8">
                  {avatars.slice(0, 3).map((avatar, index) => (
                    <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
                      <img src={WAvatar} alt="Avatar" className="w-24 h-24 mb-4" />
                      <h3 className="text-xl font-semibol">
                        {avatar.name} / {avatar.role}
                      </h3>
                      <p className="text-center">{avatar.description}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-8 mt-8">
                  {avatars.slice(3).map((avatar, index) => (
                    <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
                      <img src={WAvatar} alt="Avatar" className="w-24 h-24 mb-4" />
                      <h3 className="text-xl font-semibold ">
                        {avatar.name} / {avatar.role}
                      </h3>
                      <p className="text-center ">{avatar.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <section ref={thirdSectionRef} className="flex min-w-[1024px] h-screen">
        <AnimatePresence>
          {currentPage === 3 && (
            <motion.div
              className="relative flex flex-col justify-center w-full h-full px-32"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="absolute left-24 top-12"
                initial={{ opacity: 0, x: -1500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 1500 }}
                transition={{ duration: 2, type: 'spring' }}
              >
                <h2 className="mb-8 text-4xl font-semibold text-white">ABOUT SERVICE</h2>
                <p className="flex flex-col gap-2 text-xl text-white">
                  <span>‘모두의 중간'은 모두가 편안한 만남을 위해</span>
                  <span>
                    친구들의 위치와 나의 위치의 중간 지점을 찾아 만날 장소와 시간을 투표할 수 있는 서비스입니다!
                  </span>
                </p>
              </motion.div>
              <div className="mt-20 min-w-[1024px] mx-auto">
                <motion.div
                  className="grid grid-cols-3 gap-8 *:text-white mt-24 p-8"
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={sectionItemVariants}
                >
                  <motion.div className="flex flex-col items-center" variants={itemVariants}>
                    <img src={MidpointLogo} alt="MidpointLogo" className="mb-4 rounded-full shadow-lg size-64" />
                    <h3 className="text-xl font-semibold">중간지점찾기</h3>
                    <p className="flex flex-col items-center mt-4">
                      <span>친구들과 나의 위치를 입력하면 </span>
                      <span>우리가 만날 수 있는 중간 지점을 찾아줘요!</span>
                    </p>
                  </motion.div>
                  <motion.div className="flex flex-col items-center" variants={itemVariants}>
                    <img src={VoteLogo} alt="VoteLogo" className="mb-4 rounded-full shadow-lg size-64" />
                    <h3 className="text-xl font-semibold">장소투표하기</h3>
                    <p className="flex flex-col items-center mt-4">
                      <span>나온 장소 후보들 중에서 </span>
                      <span>친구들과 만날 장소를 투표로 한 번에 정할 수 있어요!</span>
                    </p>
                  </motion.div>
                  <motion.div className="flex flex-col items-center" variants={itemVariants}>
                    <img src={TimeLogo} alt="TimeLogo" className="mb-4 rounded-full shadow-lg size-64" />
                    <h3 className="text-xl font-semibold">시간투표하기</h3>
                    <p className="flex flex-col items-center mt-4">
                      <span>중간 지점을 찾고 만날 장소까지 정했다면 </span>
                      <span>만날 시간까지 투표로 정할 수 있어요!</span>
                    </p>
                  </motion.div>
                </motion.div>
              </div>
              <div className="min-w-[1024px] mx-auto flex justify-center p-7">
                <motion.button
                  className="w-[30%] rounded-xl shadow-xl bg-white text-blue-500 mx-auto text-xl font-semibold h-12 transition-colors hover:text-white hover:bg-[#5786FF] hover:border-2 hover:border-white"
                  whileHover={{ scale: 1.2, transition: { type: 'spring', duration: 0.5 } }}
                  whileTap={{ scale: 0.8 }}
                  onClick={toggleModal}
                >
                  중간지점찾기 바로가기
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <PlaceModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}
