import VoteCalendar, {
  DateTimeOption,
  formatTime,
  Time,
} from '@/components/TimeVote/vote-calendar';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import ClockIcon from '@/assets/imgs/Time/time-clock-icon.svg?react';
import { DateOption } from '@/components/TimeVote/vote-date-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  IDatePayload,
  ResultResponse,
  Value,
  ValuePiece,
} from '@/types/time-vote';
import { getTimeRoomExists } from '@/apis/existence.api';
import { QUERY_KEYS } from '@/constants';
import { getTimeVotes, postTimeVote, putTimeVote } from '@/apis/time-vote.api';



const TimeVote = () => {
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);

  const [clickedDate, setClickedDate] = useState<ValuePiece>(null);
  const [selectedDates, setSelectedDates] = useState<ValuePiece[]>([]);
  const [resultRes, setResultRes] = useState<ResultResponse | null>(null);
  const [dateTimeOptions, setDateTimeOptions] = useState<DateTimeOption[]>([]);

  const [voteExistence, setVoteExistence] = useState<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();
  const queryClient = useQueryClient();

  if (!roomId) {
    console.error('방 ID가 정의되지 않았습니다.');
    return;
  }

  //시간투표방 존재 여부
  const { data, error } = useQuery({
    queryKey: [QUERY_KEYS.IS_EXISTS_TIMEVOTE_ROOM, roomId],
    queryFn: () => getTimeRoomExists(roomId),
    enabled: !!roomId, // roomId가 있을 때만 쿼리 실행
  });

  //투표 결과 받기
  const { mutate: resultVoteRoom } = useMutation({
    mutationFn: () => getTimeVotes({ roomId }),
    onSuccess: (result) => {
      setResultRes(result);
    },
  });

  //투표하기
  const { mutate: handleVoteMutation } = useMutation({
    mutationFn: async (payload: IDatePayload) => {
      if (!voteExistence) {
        await postTimeVote(payload);
      } else {
        //투표수정
        await putTimeVote(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IS_VOTED, roomId],
      });
      navigate(`/page/time/results/${roomId}`);
    },
    onError: (err) => {
      console.error('투표 처리 중 오류 발생:', err);
    },
  });

  //존재 여부 검증
  useEffect(() => {
    if (data) {
      if (data.existence && data.dates && data.dates.length > 0) {
        setVoteExistence(true);
        setSelectedDates(data.dates.map((date: string) => new Date(date)));

        // 추가적인 API 호출
        resultVoteRoom();
      } else {
        navigate(`/page/room-list`);
      }
    } else if (error) {
      console.error('방 존재 여부 확인 중 오류 발생', error);
    }
  }, [data, roomId, navigate]);

  const handleTimeChange = (date: Value, startTime: Time, endTime: Time) => {
    setDateTimeOptions((prev) => {
      const existingOption = prev.find((option) => option.date === date);
      if (existingOption) {
        return prev.map((option) =>
          option.date === date ? { ...option, startTime, endTime } : option,
        );
      } else {
        return [...prev, { date, startTime, endTime }];
      }
    });
  };

  //투표버튼 클릭 시
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
      .filter(
        (
          item,
        ): item is {
          memberAvailableStartTime: string;
          memberAvailableEndTime: string;
        } => item !== null,
      );

    if (!dateTimePayload.length) {
      toast.error('참석 일시를 투표해주세요!', { position: 'top-center' });
      return;
    }

    const hasInvalidTime = dateTimePayload.some(
      ({ memberAvailableStartTime, memberAvailableEndTime }) =>
        memberAvailableStartTime >= memberAvailableEndTime,
    );
    if (hasInvalidTime) {
      toast.error('시간대를 다시 한번 확인해주세요!', {
        position: 'top-center',
      });
      return;
    }

    const payload: IDatePayload = {
      roomId,
      dateTime: dateTimePayload,
    };
    handleVoteMutation(payload);
  };

  const formatDateTime = (date: Value, time: Time): string => {
    if (!(date instanceof Date)) return '';
    return `${date.toISOString().split('T')[0]} ${formatTime(time.hour)}:${formatTime(time.minute)}`;
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
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
        <ClockIcon className="mt-4 mb-2 size-10" />
        <p className="mt-1 mb-6">참석 일시 투표</p>
        {Array.isArray(selectedDates) &&
          selectedDates.map((date, index) => (
            <DateOption
              key={
                date instanceof Date
                  ? date.toISOString()
                  : `invalid-date-${index}`
              }
              date={date}
              onTimeChange={handleTimeChange}
              roomId={roomId}
              setVoteExistence={setVoteExistence}
            />
          ))}
        <div className="h-14"></div>
        <div className="absolute bottom-2 w-[95%] mx-auto">
          <button
            className="h-14 rounded-2xl primary-btn bg-[#5786FF]"
            onClick={handleVote}
          >
            투표하기
          </button>
        </div>
      </ContainerItem>
      <ToastContainer />
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
