import VoteCalendar, { DateTimeOption, formatTime, Time } from '@/components/time/vote-calendar';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Value, ValuePiece } from '../Time/time';
import { checkVoteCreate, IDatePayload, postVoteTime, rePostVoteTime, resultVoteRoom } from '@/apis/time-vote.api';
import { defineRoomType } from '@/components/time/calendar';
import ClockIcon from '@/assets/imgs/Time/time-clock-icon.svg?react';
import { DateOption } from '@/components/time/vote-date-picker';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  if (!roomId) {
    console.error('방 ID가 정의되지 않았습니다.');
    return;
  }
  //존재 여부 검증
  useEffect(() => {
    const verifyRoomExistence = async () => {
      try {
        //시간투표방 존재하는지
        const res = await checkVoteCreate({ roomId, roomType, navigate });
        if (res.existence && res.dates && res.dates.length > 0) {
          //투표가능날짜 받아오기
          queryClient.invalidateQueries({ queryKey: ['timeVoteRoomExists', roomId] });
          setSelectedDates(res.dates.map((date: string) => new Date(date)));
          const result: ResultResponse = await resultVoteRoom({ roomId, roomType, navigate });
          setResultRes(result);
        } else {
          navigate(`/page/${roomTypeUrl}/create/time-vote-room/${roomId}`);
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

        return {
          memberAvailableStartTime,
          memberAvailableEndTime,
        };
      })
      .filter((item): item is { memberAvailableStartTime: string; memberAvailableEndTime: string } => item !== null);

    // dateTimePayload가 비어 있을 경우 바로 종료
    if (!dateTimePayload.length) {
      alert('참석 일시를 투표해주세요!');
      return;
    }

    // 시작 시간이 클 경우 동작 취소
    const hasInvalidTime = dateTimePayload.some(
      ({ memberAvailableStartTime, memberAvailableEndTime }) => memberAvailableStartTime >= memberAvailableEndTime,
    );
    if (hasInvalidTime) {
      alert('시작 시간은 종료 시간보다 빨라야 합니다.');
      return;
    }

    const payload: IDatePayload = {
      roomId,
      roomType,
      navigate,
      dateTime: dateTimePayload,
    };

    if (!voteExistence) {
      try {
        await postVoteTime(payload);
        queryClient.invalidateQueries({ queryKey: ['isTimeVoted', roomId] });
        navigate(`/page/${roomTypeUrl}/time-vote/results/${roomId}`);
      } catch (err) {
        console.error('투표 처리 중 오류 발생:', err);
      }
    } else {
      try {
        await rePostVoteTime(payload);
        navigate(`/page/${roomTypeUrl}/time-vote/results/${roomId}`);
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
    <TimeVoteStyle ref={componentRef} className="flex gap-2">
      <VoteCalendar
        selectedDates={selectedDates}
        resultRes={resultRes}
        clickedDate={clickedDate}
        setClickedDate={setClickedDate}
      />

      <ContainerItem className="relative h-full">
        <ClockIcon className="mt-3 mb-2 size-10" />
        <p className="my-2 mb-6">참석 일시 투표</p>
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
        <div className="h-14"></div>
        <div className="absolute bottom-4 w-[95%] mx-auto">
          <button className="h-14 rounded-2xl primary-btn bg-[#5786FF]" onClick={handleVote}>
            투표하기
          </button>
        </div>
      </ContainerItem>
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div`
  width: 80%;
`;

const ContainerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 50%;
  min-height: 500px;
  background: #f8f8fb;
  padding: 10px 5px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #2f5fdd;
`;

export default TimeVote;
