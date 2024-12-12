import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CalItemIcon from '@/assets/imgs/Time/time-calItem-icon1.svg?react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { postTimeVoteRoom, putTimeVoteRoom } from '@/apis/time-vote.api';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTimeRoomExists } from '@/apis/existence.api';
import { DatePickerProps, Value } from '@/types/TimeVote';
import { QUERY_KEYS } from '@/constants';

let dates: string[] = [];

const FristCalendar: React.FC<DatePickerProps> = ({
  isValue,
  selectedDates,
  onDateChange,
}) => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [isTimeVoteRoomExists, setTimeVoteRoomExists] = useState(false);
  const queryClient = useQueryClient();

  if (!roomId) {
    console.error('방 ID가 정의되지 않았습니다.');
    return;
  }

  //시간투표방 존재 여부
  const { data, error } = useQuery({
    queryKey: [QUERY_KEYS.IS_EXISTS_TIMEVOTE_ROOM],
    queryFn: () => getTimeRoomExists(roomId!),
    enabled: !!roomId, // roomId가 있을 때만 쿼리 실행
  });

  useEffect(() => {
    if (data) {
      if (data.existence && data.dates && data.dates.length > 0) {
        setTimeVoteRoomExists(true);
      }
    } else if (error) {
      console.error('방 존재 여부 확인 중 오류 발생:', error);
    }
  }, [data, error]);

  const handleDateChange = (date: Value) => {
    onDateChange(date);
  };

  //투표방 생성 or 재생성
  const { mutate: createTimeVoteRoom } = useMutation({
    mutationKey: [QUERY_KEYS.FROM_CREATE_TIME_VOTE],
    mutationFn: (dates: string[]) => {
      if (!isTimeVoteRoomExists) {
        return postTimeVoteRoom({ roomId, dates });
      } else {
        return putTimeVoteRoom({ roomId, dates });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IS_EXISTS_TIMEVOTE_ROOM, roomId],
      });
      navigate(`place/vote/${roomId}`);
    },
    onError: (error) => {
      console.error('시간투표방 생성 실패:', error);
    },
  });

  const gotoVote = async () => {
    dates = selectedDates
      .filter((date): date is Date => date instanceof Date)
      .sort((a, b) => a.getTime() - b.getTime())
      .map((date) => date.toLocaleDateString('en-CA'));

    if (!roomId) {
      alert('방 ID가 없습니다. 다른 페이지로 이동합니다.');
      navigate('/page/room-list');
      return;
    }

    if (dates.length === 0) {
      alert('날짜를 선택해 주세요');
    } else {
      createTimeVoteRoom(dates);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen item-center">
      <ContainerBox>
        <div className="flex flex-col items-center justify-center">
          <CalItemIcon />
          <StyledCalendar
            value={null}
            onChange={(value) => handleDateChange(value)}
            selectRange={false}
            locale="ko-KR"
            formatDay={(_locale, date) => date.getDate().toString()} //일 제거
            calendarType="gregory" //일요일
            showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
            next2Label={null} // +1년 & +10년 이동 버튼 숨기기
            prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
            minDetail="year" // 10년단위 년도 숨기기
            tileClassName={({ date }) =>
              selectedDates.some(
                (selectedDate) =>
                  selectedDate instanceof Date &&
                  selectedDate.toDateString() === date.toDateString(),
              )
                ? 'selected'
                : ''
            }
          />
        </div>
      </ContainerBox>
      <div className="w-[50%] mx-auto mt-2">
        <button
          onClick={() => gotoVote()}
          disabled={isValue}
          className="h-14 primary-btn rounded-2xl disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
          {isValue ? '날짜를 클릭하세요' : '다음'}
        </button>
      </div>
    </div>
  );
};

const ContainerBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 500px;
  min-height: 400px;
  // background: #f8f8fb;
  padding: 10px 5px;
  margin: 0 auto;
  border-radius: 15px;
  font-size: 18px;
  text-align: center;
  color: #2f5fdd;
`;

const StyledCalendar = styled(Calendar)`
  width: 80%;
  height: 100%;
  border: none;
  border-radius: 10px;
  margin-top: 10px;

  //전체 영역
  .react-calendar__month-view {
    display: flex;
    width: 70%;
    margin: 0 auto;
    margin-right: 8.3rem;
    padding-left: 3rem;
    abbr {
      color: #15254d;
    }
  }
  //년/월 상단 네비게이션 정렬, 크기 줄이기
  .react-calendar__navigation {
    justify-content: center;
    margin-bottom: 4px;
  }
  .react-calendar__navigation__label {
    font-weight: bold; /* 년월을 굵게 표시 */
    color: #2f5fdd;
    flex-grow: 0 !important;
  }
  .react-calendar__navigation:enabled:hover {
    background-color: #5786ff !important;
  }

  //요일 색, 밑줄
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title='일요일'] {
    color: #ff3629;
  }
  .react-calendar__month-view__weekdays__weekday abbr[title='토요일'] {
    color: #5786ff;
  }
  //요일 영역
  .react-calendar__month-view__weekdays {
    flex: 0 0 13% !important;
    max-width: 100%;
  }
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  // 타일 영역
  .react-calendar__month-view__days {
    background: transparent;
  }
  //일 스타일
  .react-calendar__tile {
    border-radius: 12px;
    cursor: pointer;
    height: 60px;
    max-width: 60px;

    overflow: hidden;
    box-sizing: border-box;
    margin: 5px;
    background: #f8f8fb;

    &:hover {
      background: #5786ff;
      color: white;
      border-radius: 12px;
    }
  }
  //일 오늘 날짜
  .react-calendar__tile--now {
    abbr {
      color: #5c76ff;
    }
  }

  /* 클릭한 날짜 (마우스 오버 또는 포커스 상태) */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #377bff !important; /* 클릭한 날짜 색상 */
    border-radius: 12px !important;
  }

  /* 클릭된 날짜 (현재 선택된 날짜) */
  .react-calendar__tile--active,
  .selected {
    background-color: #bcd7ff !important; /* 클릭된 날짜 색상 */
    border-radius: 12px !important;
  }

  /* 클릭한 날짜의 텍스트 색상 */
  .react-calendar__tile--active abbr,
  .selected abbr {
    color: #377bff; /* 텍스트 색상 */
  }
  .react-calendar__tile:enabled:hover abbr,
  .react-calendar__tile:enabled:focus abbr {
    color: white;
  }
`;

export default FristCalendar;
