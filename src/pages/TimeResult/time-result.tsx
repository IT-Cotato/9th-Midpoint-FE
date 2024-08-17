import styled from 'styled-components';
import FolderImg from '@/assets/imgs/Time/time-folder.svg?react';
import Button from '@/components/common/Button/button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { defineRoomType } from '@/components/time/calendar';
import { resultVote } from '@/apis/time-vote.api';

interface GridItem {
  id: number;
  color: string;
}

const TimeResult = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { roomType, roomTypeUrl } = defineRoomType();

  const [maxId, setMaxId] = useState<number>(13);
  const [resDates, setResDates] = useState<{ [key: string]: any[] }>({});

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const hoursTo12 = Array.from({ length: 13 }, (_, i) => `${String(i).padStart(2, '0')}`);
  const hoursTo24 = Array.from({ length: 13 }, (_, i) => `${String(i + 12).padStart(2, '0')}`);

  //색상표
  const items: GridItem[] = [
    { id: 1, color: '#FFFFFF' },
    { id: 2, color: '#E2EAFF' },
    { id: 3, color: '#ACC3FF' },
    { id: 4, color: '#80A3FF' },
    { id: 5, color: '#5786FF' },
    { id: 6, color: '#1556FF' },
    { id: 7, color: '#0042ED' },
    { id: 8, color: '#003EDF' },
    { id: 9, color: '#0035BB' },
    { id: 10, color: '#002481' },
    { id: 11, color: '#001A5D' },
    { id: 12, color: '#010E30' },
    { id: 13, color: '#000000' },
  ];

  if (!roomId) {
    console.error('방 ID가 정의되지 않았습니다.');
    return;
  }
  //결과 데이터
  useEffect(() => {
    const verifyRoomExistence = async () => {
      try {
        //투표가능날짜 받아오기
        const result = await resultVote({ roomId, roomType, navigate });
        setResDates(result.result);
        setMaxId(result.totalMemberNum);
        console.log(resDates);
      } catch (error) {
        console.error('방 존재 여부 확인 중 오류 발생:', error);
      }
    };
    verifyRoomExistence();
  }, [roomId]);

  //표시되는 날짜 리스트
  const dateKeys = Object.keys(resDates);
  const formattedDates = dateKeys.map((date) => {
    // const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    return `${month}월 ${day}일`;
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % formattedDates.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + formattedDates.length) % formattedDates.length);
  };

  return (
    <TimeResultStyle className="w-[80%] h-[80%] flex flex-col bg-[#F8F8FB] p-4 rounded-[20px] mx-auto">
      <div className="flex flex-col items-center justify-center mx-auto">
        <FolderImg className="w-16 h-16" />
        <p className="font-bold text-[#1A3C95] text-xl mt-2">이번 모임 일시는...</p>
        <p className="text-[#5E6D93] text-center mt-1">이번 모임 만남이 가능한 시간을 확인해보세요!</p>
      </div>
      <div className="flex flex-col items-center justify-center mt-3 w-full">
        <div className="flex items-center justify-evenly w-full mx-auto">
          <button onClick={handlePrev} className="arrow-button">
            &lt;
          </button>
          <p className="text-xl font-bold text-[#1A3C95] text-center">{formattedDates[currentIndex]}</p>
          <button onClick={handleNext} className="arrow-button">
            &gt;
          </button>
        </div>

        {/* 인원 */}
        <div className="flex flex-row items-center justify-center mt-2 w-full">
          <span className="mr-2">0/0 가능</span>

          <div
            className={`grid h-10 border-2 border-[#5786FF] rounded-lg overflow-hidden `}
            style={{ gridTemplateColumns: `repeat(${maxId + 1}, 20px)` }}
          >
            {items.slice(0, maxId + 1).map((item) => (
              <div
                key={item.id}
                className="h-full flex items-center justify-center"
                style={{ backgroundColor: item.color, color: item.color }}
              >
                {item.id}
              </div>
            ))}
          </div>

          <span className="ml-2">0/{maxId} 가능</span>
        </div>

        {/* 00~12시 */}
        <div className="flex flex-col w-[80%] mt-4">
          {/* 시간 표시 */}
          <div className="flex justify-between mb-1 w-full ">
            {Array.from({ length: 13 }).map((_, index) => (
              <div key={index} className="text-center  ">
                {hoursTo12[index]}
              </div>
            ))}
          </div>

          {/* 그리드 */}
          <div
            className={`grid h-14 w-full border-2 border-[#5786FF] rounded-lg overflow-hidden`}
            style={{ gridTemplateColumns: `repeat(72, 1fr)` }} // 각 칸 크기를 전체 너비의 1/72로 설정
          >
            {Array.from({ length: 72 }).map((_, index) => (
              <div
                key={index}
                className={`h-full flex items-center justify-center border-l ${index % 6 === 0 && index !== 0 ? 'border-l-2 border-[#5786FF]' : 'border-l border-dashed border-[#5786FF]'}`}
                style={{ backgroundColor: '#f0f0f0' }} // 배경색
              >
                {/* 내부는 비어 있음 */}
              </div>
            ))}
          </div>
        </div>

        {/* 12~24시 */}
        <div className="flex flex-col w-[80%] mt-4">
          {/* 시간 표시 */}
          <div className="flex justify-between mb-1 w-full ">
            {Array.from({ length: 13 }).map((_, index) => (
              <div key={index} className="text-center  ">
                {hoursTo24[index]}
              </div>
            ))}
          </div>

          {/* 그리드 */}
          <div
            className={`grid h-14 w-full border-2 border-[#5786FF] rounded-lg overflow-hidden`}
            style={{ gridTemplateColumns: `repeat(72, 1fr)` }} // 각 칸 크기를 전체 너비의 1/72로 설정
          >
            {Array.from({ length: 72 }).map((_, index) => (
              <div
                key={index}
                className={`h-full flex items-center justify-center border-l ${index % 6 === 0 && index !== 0 ? 'border-l-2 border-[#5786FF]' : 'border-l border-dashed border-[#5786FF]'}`}
                style={{ backgroundColor: '#f0f0f0' }} // 배경색
              >
                {/* 내부는 비어 있음 */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full mt-6 space-x-4">
        <Button
          text="투표 다시하기"
          isLoading={false}
          onClick={() => navigate(`/page/${roomTypeUrl}/time-vote/${roomId}`)}
        ></Button>
        <Button
          text="투표 재생성하기"
          isLoading={false}
          onClick={() => navigate(`page//${roomTypeUrl}/create/time-vote-room/${roomId}`)}
        ></Button>
      </div>
    </TimeResultStyle>
  );
};

const TimeResultStyle = styled.div``;

export default TimeResult;
