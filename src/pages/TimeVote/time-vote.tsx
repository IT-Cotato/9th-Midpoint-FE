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

const TimeVote = () => {
  const navigate = useNavigate();

  const [clickedDate, setClickedDate] = useState<ValuePiece>(null);
  const [selectedDates, setSelectedDates] = useState<ValuePiece[]>([]);

  const { roomId } = useParams<{ roomId: string }>(); // URL에서 id 파라미터 가져오기

  const { roomType, roomTypeUrl } = defineRoomType();

  useEffect(() => {
    const verifyRoomExistence = async () => {
      if (!roomId) {
        console.error('방 ID가 정의되지 않았습니다.');
        return;
      }
      try {
        const res = await checkVoteRoom({ roomId, roomType, navigate });
        if (res.existence && res.dates && res.dates.length > 0) {
          // selectedDates를 상태로 관리하도록 수정
          setSelectedDates(res.dates.map((date: string) => new Date(date))); // 날짜를 Date 객체로 변환하여 저장
          console.log(selectedDates);
          console.log(selectedDates);
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
        setClickedDate(date); // 클릭한 날짜를 상태에 설정
        console.log(date); // 클릭한 날짜를 콘솔에 출력
      }
    } else {
      // date가 Date가 아닌 경우 추가 처리 (필요시)
      console.warn('클릭한 날짜는 유효한 Date 형식이 아닙니다:', date);
    }
  };

  return (
    <TimeVoteStyle className="flex flex-col">
      <VoteCalendar selectedDates={selectedDates} onDateChange={handleDateClick} />
      <VoteDate clickedDate={clickedDate} />
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div``;

export default TimeVote;
