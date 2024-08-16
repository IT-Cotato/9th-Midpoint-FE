// import { checkVoteRoom } from '@/apis/time-vote.api';
import VoteCalendar from '@/components/time/vote-calendar';
// import VoteDate from '@/components/time/vote-date';
import { useEffect, useRef, useState } from 'react';
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

export type VoteDateInfo = Pick<ResultResponse['result'][string][0], 'memberName' | 'dateTime'>;

const TimeVote = () => {
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  const [clickedDate, setClickedDate] = useState<ValuePiece>(null);
  const [selectedDates, setSelectedDates] = useState<ValuePiece[]>([]);
  const [resultRes, setResultRes] = useState<ResultResponse | null>(null);
  const [voteDateInfo, setVoteDateInfo] = useState<VoteDateInfo[]>([]);

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
          setResultRes(result);
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
    if (date instanceof Date) {
      const isSelected = selectedDates.some(
        (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
      );

      if (isSelected) {
        setClickedDate(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const dateString = `${year}-${month}-${day}`;
        console.log('캘린더에서 클릭한 날짜', dateString);

        if (resultRes) {
          let foundInfo = resultRes.result[dateString];

          if (foundInfo) {
            console.log('해당 날짜의 하위 정보:', foundInfo);
            setVoteDateInfo(foundInfo);

            if (foundInfo.length === 0) console.log('빈값');
          } else {
            console.log('해당 날짜에 대한 정보가 없습니다.');
          }
        }
        setClickedDate(date);
      } else {
        setClickedDate(null);
      }
    } else {
      console.warn('클릭한 날짜는 유효한 Date 형식이 아닙니다:', date);
    }
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setClickedDate(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <TimeVoteStyle ref={componentRef} className="flex flex-col">
      <VoteCalendar
        selectedDates={selectedDates}
        onDateChange={handleDateClick}
        roomId={roomId}
        roomType={roomType}
        roomTypeUrl={roomTypeUrl}
        navigate={navigate}
      />
      {clickedDate && <VoteDate clickedDate={clickedDate} voteDateInfo={voteDateInfo} />}
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div``;

export default TimeVote;
