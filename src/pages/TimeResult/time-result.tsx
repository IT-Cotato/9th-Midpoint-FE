import styled from 'styled-components';
import FolderImg from '@/assets/imgs/Time/time-folder.svg?react';
import { MdArrowLeft } from 'react-icons/md';
import { MdArrowRight } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { defineRoomType } from '@/components/time/calendar';
import { resultVote } from '@/apis/time-vote.api';
import { useQueryClient } from '@tanstack/react-query';

interface GridItem {
  id: number;
  color: string;
}

interface DateTimeItem {
  memberAvailableStartTime: string;
  memberAvailableEndTime: string;
}

interface NowDateDataItem {
  memberName: string;
  dateTime: DateTimeItem[];
}

//색상표
export const items: GridItem[] = [
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

const TimeResult = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const { roomType, roomTypeUrl } = defineRoomType();
  const queryClient = useQueryClient();

  const [maxId, setMaxId] = useState<number>(13);
  const [resDates, setResDates] = useState<{ [key: string]: any[] }>({});

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [morGridColors, setMorGridColors] = useState(Array(72).fill(items[0].color)); // 초기 색상 설정
  const [afterGridColors, setAfterGridColors] = useState(Array(72).fill(items[0].color)); // 초기 색상 설정

  const hoursTo12 = Array.from({ length: 13 }, (_, i) => `${String(i).padStart(2, '0')}`);
  const hoursTo24 = Array.from({ length: 13 }, (_, i) => `${String(i + 12).padStart(2, '0')}`);

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
        queryClient.invalidateQueries({ queryKey: ['timeVoteRoomExists', roomId] });
      } catch (error) {
        console.error('방 존재 여부 확인 중 오류 발생:', error);
      }
    };
    verifyRoomExistence();
  }, [roomId, currentIndex]);

  //표시되는 날짜 리스트
  const dateKeys = Object.keys(resDates);
  const formattedDates = dateKeys.map((date) => {
    // const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];

    return `${month}월 ${day}일`;
  });
  //날짜 화살표
  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < formattedDates.length - 1) {
        return prevIndex + 1; // 다음으로 이동
      }
      return prevIndex; // 마지막 인덱스에서 더 이상 이동하지 않음
    });
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1; // 이전으로 이동
      }
      return prevIndex; // 첫 번째 인덱스에서 더 이상 이동하지 않음
    });
  };

  useEffect(() => {
    logNowDateData();
  }, [resDates, currentIndex]);

  // 10분 단위로 인덱스
  const getTimeIndex = (timeString: string) => {
    const time = timeString.split(' ')[1];
    const [hour, minute] = time.split(':').map(Number);
    return hour * 6 + Math.floor(minute / 10); // 10분 단위로 계산
  };

  // 막대그래프 색상 적용
  const fillGridColors = (nowDateData: NowDateDataItem[]) => {
    const morGridColors = Array(72).fill(items[0].color);
    const afterGridColors = Array(72).fill(items[0].color);
    // 시간대별로 이름 수를 세기 위한 배열
    const morCount = Array(72).fill(0);
    const afterCount = Array(72).fill(0);

    nowDateData.forEach((item) => {
      // dateTime이 존재하는 경우에만 처리
      if (item.dateTime.length > 0) {
        item.dateTime.forEach((dateTimeItem) => {
          // 각 dateTime 항목을 순회
          const startTime = dateTimeItem.memberAvailableStartTime;
          const endTime = dateTimeItem.memberAvailableEndTime;
          const startIndex = getTimeIndex(startTime);
          const endIndex = getTimeIndex(endTime);

          // 0~12시 범위
          if (startIndex >= 0 && startIndex <= 72) {
            for (let i = startIndex; i < Math.min(endIndex, 72); i++) {
              morCount[i]++;
            }
          }
          // 12~24시 범위
          if (endIndex > 72) {
            for (let i = Math.max(startIndex - 72, 0); i < Math.min(endIndex - 72, 72); i++) {
              afterCount[i]++;
            }
          }
        });
      }
    });

    // 색상 적용
    morCount.forEach((count, index) => {
      if (count > 0) {
        morGridColors[index] = items[Math.min(count, items.length - 1)].color;
      }
    });
    afterCount.forEach((count, index) => {
      if (count > 0) {
        afterGridColors[index] = items[Math.min(count, items.length - 1)].color;
      }
    });

    return { morGridColors, afterGridColors };
  };

  const logNowDateData = () => {
    const nowDateKey = dateKeys[currentIndex];
    const nowDateData: NowDateDataItem[] = resDates[nowDateKey] || [];
    const { morGridColors, afterGridColors } = fillGridColors(nowDateData);
    setMorGridColors(morGridColors);
    setAfterGridColors(afterGridColors);
  };

  return (
    <TimeResultStyle className="w-[80%] h-full flex flex-col bg-[#F8F8FB] p-4 rounded-[20px] mx-auto">
      <div className="flex flex-col items-center justify-center mx-auto mt-5">
        <FolderImg className="w-16 h-16" />
        <p className="font-bold text-[#1A3C95] text-xl mt-3">이번 모임 일시는...</p>
        <p className="text-[#5E6D93] text-center mt-3">이번 모임 만남이 가능한 시간을 확인해보세요!</p>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow w-full -mt-3">
        <div className="flex items-center w-[25%] mx-auto mb-3 justify-evenly">
          <button
            onClick={handlePrev}
            className={`${currentIndex === 0 ? 'text-[#F8F8FB]' : 'text-[#BCD7FF]'}`}
            disabled={currentIndex === 0}
          >
            <MdArrowLeft className="text-4xl" />
          </button>
          <p className="text-xl font-bold text-[#1A3C95] text-center">{formattedDates[currentIndex]}</p>
          <button
            onClick={handleNext}
            className={`${currentIndex === formattedDates.length - 1 ? 'text-[#F8F8FB]' : 'text-[#BCD7FF]'}`}
            disabled={currentIndex === formattedDates.length - 1}
          >
            <MdArrowRight className="text-4xl" />
          </button>
        </div>

        {/* 인원 */}
        <div className="flex flex-row items-center justify-center w-full mx-auto mt-2 mb-2">
          <span className="mr-3">0/0 가능</span>
          <div
            className={`grid h-10 border-2 border-[#5786FF] rounded-2xl overflow-hidden `}
            style={{ gridTemplateColumns: `repeat(${maxId + 1}, 20px)` }}
          >
            {items.slice(0, maxId + 1).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-center h-full"
                style={{ backgroundColor: item.color, color: item.color }}
              >
                {item.id}
              </div>
            ))}
          </div>

          <span className="ml-3">
            {maxId}/{maxId} 가능
          </span>
        </div>

        {/* 00~12시 */}
        <div className="flex flex-col w-[80%] mt-4">
          {/* 시간 표시 */}
          <div className="flex justify-between w-full mb-1 ">
            {Array.from({ length: 13 }).map((_, index) => (
              <div key={index} className="text-center ">
                {hoursTo12[index]}
              </div>
            ))}
          </div>

          {/* 그리드 */}
          <div
            className={`grid h-14 w-full border-2 border-[#5786FF] rounded-2xl overflow-hidden`}
            style={{ gridTemplateColumns: `repeat(72, 1fr)` }}
          >
            {morGridColors.map((color, index) => (
              <div
                key={index}
                className={`h-full flex items-center justify-center border-l ${index % 6 === 0 && index !== 0 ? 'border-l-2 border-[#5786FF]' : 'border-l border-dashed border-[#5786FF]'}`}
                style={{ backgroundColor: color }}
              >
                {/* 내부는 비어 있음 */}
              </div>
            ))}
          </div>
        </div>

        {/* 12~24시 그리드 */}
        <div className="flex flex-col w-[80%] mt-4">
          {/* 시간 표시 */}
          <div className="flex justify-between w-full mb-1 ">
            {Array.from({ length: 13 }).map((_, index) => (
              <div key={index} className="text-center">
                {hoursTo24[index]}
              </div>
            ))}
          </div>

          {/* 그리드 */}
          <div
            className={`grid h-14 w-full border-2 border-[#5786FF] rounded-2xl overflow-hidden`}
            style={{ gridTemplateColumns: `repeat(72, 1fr)` }}
          >
            {afterGridColors.map((color, index) => (
              <div
                key={index}
                className={`h-full flex items-center justify-center border-l ${index % 6 === 0 && index !== 0 ? 'border-l-2 border-[#5786FF]' : 'border-l border-dashed border-[#5786FF]'}`}
                style={{ backgroundColor: color }}
              >
                {/* 내부는 비어 있음 */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bottom-0 flex justify-between w-full gap-4 -mt-1">
        <button
          type="submit"
          className="h-14 primary-btn rounded-2xl bg-[#5786FF]"
          onClick={() => navigate(`/page/${roomTypeUrl}/time-vote/${roomId}`)}
        >
          투표 다시하기
        </button>
        <button
          type="submit"
          className="h-14 primary-btn rounded-2xl bg-[#B7BDCC] hover:bg-gray-400"
          onClick={() => navigate(`/page/${roomTypeUrl}/create/time-vote-room/${roomId}`)}
        >
          투표 재생성하기
        </button>
      </div>
    </TimeResultStyle>
  );
};

const TimeResultStyle = styled.div``;

export default TimeResult;
