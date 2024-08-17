import VoteCalendar, { DateTimeOption, formatTime, Time } from '@/components/time/vote-calendar';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Value, ValuePiece } from '../Time/time';
import { checkVoteRoom, IDatePayload, postVoteTime, rePostVoteTime, resultVoteRoom } from '@/apis/time-vote.api';
import { defineRoomType } from '@/components/time/calendar';
import ClockIcon from '@/assets/imgs/Time/time-clock-icon.svg?react';
import Button from '@/components/common/Button/button';
import { DateOption } from '@/components/time/vote-date-picker';

export interface ResultResponse {
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
  const [dateTimeOptions, setDateTimeOptions] = useState<DateTimeOption[]>([]);

  const [voteExistence, setVoteExistence] = useState<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();
  const { roomType, roomTypeUrl } = defineRoomType();

  if (!roomId) {
    console.error('방 ID가 정의되지 않았습니다.');
    return;
  }
  //존재 여부 검증
  useEffect(() => {
    const verifyRoomExistence = async () => {
      try {
        //시간투표방 존재하는지
        const res = await checkVoteRoom({ roomId, roomType, navigate });
        if (res.existence && res.dates && res.dates.length > 0) {
          //투표가능날짜 받아오기
          setSelectedDates(res.dates.map((date: string) => new Date(date)));
          const result: ResultResponse = await resultVoteRoom({ roomId, roomType, navigate });
          setResultRes(result);
        } else {
          navigate(`/page/${roomTypeUrl}/time/${roomId}`);
        }
      } catch (error) {
        console.error('방 존재 여부 확인 중 오류 발생:', error);
      }
    };
    verifyRoomExistence();
  }, [roomId]);

  const handleTimeChange = (date: Value, startTime: Time, endTime: Time) => {
    setDateTimeOptions((prev) => {
      const existingOption = prev.find((option) => option.date === date);
      if (existingOption) {
        return prev.map((option) => (option.date === date ? { ...option, startTime, endTime } : option));
      } else {
        return [...prev, { date, startTime, endTime }];
      }
    });
  };

  const handleVote = async () => {
    const dateTimePayload = dateTimeOptions
      .map(({ date, startTime, endTime }) => {
        const memberAvailableStartTime = formatDateTime(date, startTime);
        const memberAvailableEndTime = formatDateTime(date, endTime);
        //시작 시간이 클경우 동작취소
        if (memberAvailableStartTime > memberAvailableEndTime) {
          alert('시작 시간은 종료 시간보다 빨라야 합니다.');
          return null;
        }
        return {
          memberAvailableStartTime,
          memberAvailableEndTime,
        };
      })
      .filter((item) => item !== null);

    const payload: IDatePayload = {
      roomId,
      roomType,
      navigate,
      dateTime: dateTimePayload,
    };

    if (!dateTimePayload.length) {
      alert('참석 일시를 투표해주세요!');
      return;
    }
    if (!voteExistence) {
      try {
        await postVoteTime(payload);
        navigate(`/page/${roomTypeUrl}/time/results/${roomId}`);
      } catch (err) {
        console.error('투표 처리 중 오류 발생:', err);
      }
    }
    else{
      try {
        await rePostVoteTime(payload);
        navigate(`/page/${roomTypeUrl}/time/results/${roomId}`);
      } catch (err) {
        console.error('재투표 처리 중 오류 발생:', err);
      }
    }
  };

  const formatDateTime = (date: Value, time: Time): string => {
    if (!(date instanceof Date)) return '';
    return `${date.toISOString().split('T')[0]} ${formatTime(time.hour)}:${formatTime(time.minute)}`;
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
    <TimeVoteStyle ref={componentRef} className="flex flex-row ">
      <VoteCalendar
        selectedDates={selectedDates}
        resultRes={resultRes}
        clickedDate={clickedDate}
        setClickedDate={setClickedDate}
      />

      <ContainerItem className="relative">
        <ClockIcon />
        <p className="my-2">참석 일시 투표</p>
        {Array.isArray(selectedDates) &&
          selectedDates.map((date, index) => (
            <DateOption
              key={date instanceof Date ? date.toISOString() : `invalid-date-${index}`}
              date={date}
              onTimeChange={handleTimeChange}
              roomId={roomId}
              setVoteExistence={setVoteExistence}
            />
          ))}
        <div className="absolute bottom-0 w-full">
          <Button text="투표하기" onClick={handleVote} isLoading={false}></Button>
        </div>
      </ContainerItem>
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div``;
const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 40%;
  min-width: 480px;
  min-height: 500px;
  background: #f8f8fb;
  padding: 10px 5px;
  margin: 10px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #2f5fdd;
`;

export default TimeVote;
