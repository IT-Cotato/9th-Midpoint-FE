// import { checkVoteRoom } from '@/apis/time-vote.api';
import VoteCalendar from '@/components/time/vote-calendar';
// import VoteDate from '@/components/time/vote-date';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Value, ValuePiece } from '../Time/time';
import { checkVoteRoom, resultVoteRoom } from '@/apis/time-vote.api';
import VoteDate from '@/components/time/vote-date';
import { defineRoomType } from '@/components/time/calendar';

interface ResultResponse {
  result: {
    [date: string]: {
      memberName: string;
      dateTime: {
        memberAvailableStartTime: string;
        memberAvailableEndTime: string;
      }[];
    }[];
  };
  totalMemberNum: number;
}

const TimeVote = () => {
  const navigate = useNavigate();

  const [clickedDate, setClickedDate] = useState<ValuePiece>(null);
  const [selectedDates, setSelectedDates] = useState<ValuePiece[]>([]);
  const [resultRes, setResultRes] = useState<ResultResponse | null>(null);

  const { roomId } = useParams<{ roomId: string }>();

  const { roomType, roomTypeUrl } = defineRoomType();

  if (!roomId) {
    console.error('방 ID가 정의되지 않았습니다.');
    return;
  }

  useEffect(() => {
    const verifyRoomExistence = async () => {
      try {
        const res = await checkVoteRoom({ roomId, roomType, navigate });
        if (res.existence && res.dates && res.dates.length > 0) {
          setSelectedDates(res.dates.map((date: string) => new Date(date)));
          const result: ResultResponse = await resultVoteRoom({ roomId, roomType, navigate });
          setResultRes(result); // 상태 업데이트
          console.log(result);
        } else {
          navigate(`/page/${roomTypeUrl}/time/${roomId}`);
        }
      } catch (error) {
        console.error('방 존재 여부 확인 중 오류 발생:', error);
      }
    };
    verifyRoomExistence();
  }, [roomId]);

  const handleDateClick = (date: Value | ValuePiece) => {
    // date가 Date 인스턴스인지 확인
    if (date instanceof Date) {
      const isSelected = selectedDates.some(
        (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
      );

      if (isSelected) {
        setClickedDate(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');

        // YYYY-MM-DD 형식으로 조합
        const dateString = `${year}-${month}-${day}`;
        console.log('캘린더에서 클릭한 날짜', dateString);

        // resultRes가 null이 아닐 경우에만 처리
        if (resultRes) {
          const dateExists = Object.keys(resultRes.result)
            .map((key) => key === dateString)
            .includes(true);

          if (dateExists) {
            console.log('해당 날짜의 하위 정보:', resultRes.result[dateString]);
          } else {
            console.log('해당 날짜에 대한 정보가 없습니다.');
          }
        }
      }
    } else {
      console.warn('클릭한 날짜는 유효한 Date 형식이 아닙니다:', date);
    }
  };

  return (
    <TimeVoteStyle className="flex flex-col">
      <VoteCalendar
        selectedDates={selectedDates}
        onDateChange={handleDateClick}
        roomId={roomId}
        roomType={roomType}
        navigate={navigate}
      />
      <VoteDate clickedDate={clickedDate} />
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div``;

export default TimeVote;
