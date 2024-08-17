import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';
import WAvatar from '@/assets/imgs/Home/w_avatar.png';
import PlaceModal from '@/components/Modal/PlaceModal';
import BigClock from '@/assets/imgs/Home/BigClock.svg?react';
import Blinker from '@/assets/imgs/Home/Blinker.svg?react';
import Car from '@/assets/imgs/Home/Car.svg?react';
import Career from '@/assets/imgs/Home/Career.svg?react';
import BigBlueClock from '@/assets/imgs/Home/BigBlueClock.svg?react';
import Map from '@/assets/imgs/Home/Map.svg?react';
import PinkVote from '@/assets/imgs/Home/PinkVote.svg?react';
import SpeechBubble from '@/assets/imgs/Home/speechBubble.svg?react';
import Target from '@/assets/imgs/Home/Target.svg?react';
import NextArrow from '@/assets/imgs/Home/nextArrow.svg?react';
import Tower from '@/assets/imgs/Home/Tower.svg?react';
import MiniCar from '@/assets/imgs/Home/MiniCar.svg?react';

interface DotProps {
  num: number;
  currentPage: number;
  onClick: (page: number) => void;
}

interface DotsProps {
  currentPage: number;
  onDotClick: (page: number) => void;
}

function Dot({ num, currentPage, onClick }: DotProps) {
  const isActive = currentPage === num;
  const activeColor = '#5786FF';
  const inactiveBorderColor = '#FFFFFF';
  const isFourthPage = currentPage === 4;

  return (
    <div
      onClick={() => onClick(num)}
      className={`w-4 h-4 border-2 rounded-full cursor-pointer transition-all duration-500 ${
        isActive ? `bg-[${activeColor}] border-[${inactiveBorderColor}]` : `border-[${inactiveBorderColor}]`
      }`}
      style={{
        backgroundColor: isActive ? activeColor : inactiveBorderColor,
        borderColor: isFourthPage ? '#0F1F49' : isActive ? inactiveBorderColor : activeColor,
      }}
    ></div>
  );
}

function Dots({ currentPage, onDotClick }: DotsProps) {
  return (
    <div className="fixed z-50 flex flex-col items-center justify-between space-y-4 transform -translate-y-1/2 top-1/2 right-16">
      <Dot num={1} currentPage={currentPage} onClick={onDotClick} />
      <Dot num={2} currentPage={currentPage} onClick={onDotClick} />
      <Dot num={3} currentPage={currentPage} onClick={onDotClick} />
      <Dot num={4} currentPage={currentPage} onClick={onDotClick} />
    </div>
  );
}

export default function Home() {
  const outerDivRef = useRef<HTMLDivElement>(null);
  const fourthSectionRef = useRef<HTMLDivElement>(null);
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
        if (currentPage < 4) {
          setCurrentPage((prev) => Math.min(prev + 1, 4));
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
    setCurrentPage(4);
    fourthSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const topPerson = [
    {
      name: '이솔',
      role: 'PM',
      univ: '이화여대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
      avartar: <MainLogo />,
    },
    {
      name: '김기림',
      role: 'PM',
      univ: '이화여대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
    {
      name: '조연수',
      role: 'DS',
      univ: '홍익대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
  ];
  const botPerson = [
    {
      name: '김태윤',
      role: 'FE-LEAD',
      univ: '동국대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
    {
      name: '채다희',
      role: 'FE',
      univ: '가톨릭대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
    {
      name: '윤찬호',
      role: 'BE-LEAD',
      univ: '홍익대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
    {
      name: '신예진',
      role: 'BE',
      univ: '숙명여대',
      description: '서비스 전체를 총괄하고 최종 방향성을 제시하며 기획과 디자인을 담당',
    },
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
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const sectionItemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 2 } },
    exit: { opacity: 0 },
  };

  const MidpointVariants = {
    hidden: { opacity: 0, scale: 1.4 },
    show: { opacity: 1, transition: { duration: 2 }, scale: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div ref={outerDivRef} className="h-screen overflow-x-hidden overflow-y-auto outer">
      <Dots currentPage={currentPage} onDotClick={handleDotClick} />
      <section className="flex flex-col h-screen bg-[#5786FF] min-w-[1024px] relative p-5 gap-32">
        <div className="flex flex-col w-[55%] gap-7 py-10 px-4 bg-white rounded-2xl min-w-[40%] pl-10">
          <div className="flex items-center gap-5 mb-5">
            <MainLogo className="size-14" />
            <h1 className="text-7xl font-semibold text-[#253E7F]">syncspot</h1>
          </div>
          <h1 className="text-[#253E7F]  text-xl">모두가 편하게 만날 수 있는 지름길, 싱크스팟!</h1>
        </div>
        <div className="bg-[#AFC5FF] w-full rounded-2xl h-1/2 relative">
          <motion.button
            className="absolute flex items-center gap-4 px-10 py-5 text-lg font-semibold text-white transition-all cursor-pointer -top-10 left-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl"
            onClick={handleIconClick}
            whileHover={{
              background: '#FFFFFF',
              color: '#1A3C95',
              boxShadow: '0px 0px 20px 0px rgba(47, 95, 221, 0.50)',
              transition: { duration: 0.1, type: 'spring' },
              scale: 1.1,
            }}
            whileTap={{
              background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
              color: '#FFFFFF',
              boxShadow: '0px 0px 0px 0px rgba(0, 0, 0, 0)',
              scale: 1,
              transition: { duration: 0.2, type: 'spring' },
            }}
            style={{
              background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
            }}
          >
            지금 바로 중간지점을 찾아보세요! <NextArrow className="size-6" />
          </motion.button>
          <SpeechBubble className="absolute -top-40 left-64" />
          <h1 className="absolute font-semibold text-md text-white -top-[95px] left-[355px]">
            여기를 눌러 싱크스팟을 사용해 보세요!
          </h1>
          <div className="flex items-center gap-5 mt-20 ml-14 *:text-xl text-[#1A3C95]">
            <h1>Cotato 9th</h1>
            <h1>2024.03. - 2024.08.</h1>
          </div>
          <Career className="absolute -top-60 left-[550px] size-[500px] z-50" />
          <div className="bg-white rounded-2xl w-[360px] h-[230px] absolute -top-60 left-[850px] z-30">
            <Map className="absolute left-10" />
          </div>
          <Target className="absolute bottom-4 size-[340px] right-4" />
        </div>
      </section>
      <section className="h-screen min-w-[1024px] bg-[#EFF3FF]">
        <AnimatePresence>
          {currentPage === 2 && (
            <motion.div
              className="relative flex flex-col items-center justify-center w-full h-full px-10"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="absolute mt-5 left-24 top-7"
                initial={{ opacity: 0, x: -1500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 1500 }}
                transition={{ duration: 2, type: 'spring' }}
              >
                <h2 className="mb-8 text-4xl font-semibold text-[#1A3C95] flex gap-2 items-center">
                  <MainLogo className="size-8" /> <span>About Us</span>
                </h2>
                <p className="flex flex-col gap-2 text-xl *:text-[#5E6D93]">
                  <span>
                    <span className="text-2xl font-bold text-[#5786FF]">IT 연합동아리 코테이토</span>를 아시나요?
                  </span>
                  <span>
                    <span className="text-[#5786FF] font-semibold">팀 'ASAP'</span>은 코테이토에서 만난 7명이 모여
                    모두가 편안한 만남을 가질 수 있는 서비스를 위해 결성된 팀이에요!
                  </span>
                </p>
              </motion.div>
              <div className="*:text-black mt-32 rounded-xl p-10 min-w-[1024px] mx-auto">
                <div className="grid grid-cols-3 gap-2 mt-16">
                  {topPerson.map((avatar, index) => (
                    <motion.div
                      key={index}
                      className="relative flex flex-col items-center w-[90%] mx-auto"
                      variants={itemVariants}
                    >
                      <img src={WAvatar} alt="Avatar" className="absolute size-24 -top-14" />
                      <div className="flex flex-col items-center w-full gap-2 px-1 bg-white pt-14 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#EA3B70] text-white p-1 rounded-lg font-semibold">{avatar.role}</span>
                          <span className="text-[#1A3C95] font-semibold text-lg">{avatar.name}</span>
                          <span className="text-[#7C8BB2]">{avatar.univ}</span>
                        </div>
                        <p className="text-[#253E7F] text-center">{avatar.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-32">
                  {botPerson.map((avatar, index) => (
                    <motion.div
                      key={index}
                      className="relative flex flex-col items-center w-full mx-auto"
                      variants={itemVariants}
                    >
                      <img src={WAvatar} alt="Avatar" className="absolute size-24 -top-14" />
                      <div className="flex flex-col items-center w-full gap-2 px-1 bg-white pt-14 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#EA3B70] text-white p-1 rounded-lg font-semibold">{avatar.role}</span>
                          <span className="text-[#1A3C95] font-semibold text-lg">{avatar.name}</span>
                          <span className="text-[#7C8BB2]">{avatar.univ}</span>
                        </div>
                        <p className="text-[#253E7F] text-center">{avatar.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <section className="flex min-w-[1024px] h-screen">
        <AnimatePresence>
          {currentPage === 3 && (
            <motion.div
              className="relative flex flex-col justify-center w-full h-full px-20"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              <motion.div
                className="absolute mt-5 left-24 top-7"
                initial={{ opacity: 0, x: -1500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 1500 }}
                transition={{ duration: 2, type: 'spring' }}
              >
                <h2 className="mb-8 text-4xl font-semibold text-[#1A3C95] flex gap-2 items-center">
                  <MainLogo className="size-8" />
                  <span>Our Service</span>
                </h2>
                <p className="flex flex-col gap-2 text-xl *:text-[#5E6D93]">
                  <span>
                    <span className="text-[#5786FF] font-semibold text-3xl">syncspot</span>은 모두가 편안한 만남을 위해
                  </span>
                  <span>
                    친구들의 위치와 나의 위치의 중간 지점을 찾아 만날 장소와 시간을 투표할 수 있는 서비스입니다!
                  </span>
                </p>
              </motion.div>
              <div className="mt-20 min-w-[1024px] mx-auto">
                <motion.div
                  className="grid w-full grid-cols-3 gap-3 p-3 mt-24"
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={sectionItemVariants}
                >
                  <motion.div
                    className="relative flex flex-col items-center p-10 rounded-xl bg-[#e3e9ff] opacity-80"
                    variants={itemVariants}
                  >
                    <BigClock className="absolute top-40 left-20 size-24" />
                    <Map className="absolute top-12 right-5 size-56" />
                    <div className="flex flex-col items-center mt-60">
                      <h3 className="text-[#253E7F] text-md">첫 번째 기능</h3>
                      <h3 className="text-2xl font-semibold text-[#253E7F]">중간지점찾기</h3>
                      <p className="flex flex-col items-center mt-4 *:text-[#5E6D93] *:text-nowrap">
                        <span>친구들과 나의 위치를 입력하면 </span>
                        <span>우리가 만날 수 있는 중간 지점을 찾아줘요!</span>
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="relative flex flex-col items-center p-10 rounded-xl bg-[#e3e9ff] opacity-80"
                    variants={itemVariants}
                  >
                    <Blinker className="absolute top-20 left-20 size-24" />
                    <Car className="absolute top-24 right-12 size-40" />
                    <div className="flex flex-col items-center mt-60">
                      <h3 className="text-[#253E7F]">두 번째 기능</h3>
                      <h3 className="text-2xl font-semibold text-[#253E7F]">장소투표하기</h3>
                      <p className="flex flex-col items-center mt-4 *:text-[#5E6D93]  *:text-nowrap">
                        <span>나온 장소 후보들 중에서 </span>
                        <span>친구들과 만날 장소를 투표로 한 번에 정할 수 있어요!</span>
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    className="relative flex flex-col items-center p-10 rounded-xl bg-[#e3e9ff] opacity-80"
                    variants={itemVariants}
                  >
                    <BigBlueClock className="absolute top-24 left-20 size-40" />
                    <PinkVote className="absolute top-14 right-16 size-24" />
                    <div className="flex flex-col items-center mt-60">
                      <h3 className="text-[#253E7F]">세 번째 기능</h3>
                      <h3 className="text-2xl font-semibold text-[#253E7F]">시간투표하기</h3>
                      <p className="flex flex-col items-center mt-4 *:text-[#5E6D93] *:text-nowrap">
                        <span>중간 지점을 찾고 만날 장소까지 정했다면,</span>
                        <span>만날 시간까지 투표로 정할 수 있어요!</span>
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <section
        ref={fourthSectionRef}
        className="flex flex-col gap-10 items-center justify-center min-w-[1024px] h-screen bg-[#0F1F49]"
      >
        <AnimatePresence>
          {currentPage === 4 && (
            <>
              <Tower />
              <motion.h1
                className="text-3xl font-semibold text-white"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={MidpointVariants}
              >
                그럼, 지금 바로 <span className="text-blue-300">중간 지점</span>을 찾아볼까요?
              </motion.h1>
              <motion.button
                className="flex items-center gap-4 px-10 py-3 text-lg text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl hover:bg-blue-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleModal}
              >
                <span className="font-semibold">여기를 눌러 싱크스팟 바로가기 </span>
                <MiniCar />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </section>

      <PlaceModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
}
