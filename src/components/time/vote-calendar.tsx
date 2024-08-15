import React, { useState } from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import CalIcon from '@/assets/imgs/time-calItem-icon1.svg?react';
import ClockIcon from '@/assets/imgs/time-clock-icon.svg?react';
import { DatePickerProps } from './calendar';
import { Value, ValuePiece } from '@/pages/Time/time';
import Button from '../common/Button/button';
import { IDatePayload, postVoteTime } from '@/apis/time-vote.api';

// 타입 정의
interface DateTimeOption {
  date: Value;
  startTime: Time;
  endTime: Time;
}

interface Time {
  hour: number;
  minute: number;
}

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

const VoteCalendar: React.FC<DatePickerProps & { roomId: string; roomType: string; navigate: Function }> = ({
  selectedDates,
  onDateChange,
  roomId,
  roomType,
  navigate,
}) => {
  const [dateTimeOptions, setDateTimeOptions] = useState<DateTimeOption[]>([]);

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

  const handleDateClick = (date: Value) => {
    onDateChange(date);
  };

  const handleVote = async () => {
    const dateTimePayload = dateTimeOptions.map(({ date, startTime, endTime }) => ({
      memberAvailableStartTime: formatDateTime(date, startTime),
      memberAvailableEndTime: formatDateTime(date, endTime),
    }));

    const payload: IDatePayload = {
      roomId,
      roomType,
      navigate,
      dateTime: dateTimePayload.length > 0 ? dateTimePayload : undefined,
    };

    try {
      await postVoteTime(payload);
      console.log(payload);
      console.log('투표 결과가 성공적으로 처리되었습니다.');
    } catch (err) {
      console.error('투표 처리 중 오류 발생:', err);
    }
  };

  const formatDateTime = (date: Value, time: Time): string => {
    if (!(date instanceof Date)) return '';
    return `${date.toISOString().split('T')[0]} ${formatTime(time.hour)}:${formatTime(time.minute)}`;
  };

  return (
    <>
      <div className="flex flex-row item-center justify-center">
        <ContainerItem>
          <CalIcon />
          <StyledCalendar
            value={null}
            onChange={(value) => handleDateClick(value)}
            locale="ko-KR"
            selectRange={false}
            formatDay={(_locale, date) => date.getDate().toString()} //일 제거
            calendarType="gregory" //일요일
            showNeighboringMonth={false} // 전달, 다음달 날짜 숨기기
            next2Label={null} // +1년 & +10년 이동 버튼 숨기기
            prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
            minDetail="year" // 10년단위 년도 숨기기
            tileClassName={({ date }) =>
              selectedDates.some(
                (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
              )
                ? 'selected'
                : ''
            }
            tileDisabled={({ date }) =>
              !selectedDates.some(
                (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
              )
            }
            onClickDay={(date) => {
              if (
                selectedDates.some(
                  (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
                )
              ) {
                handleDateClick(date);
              }
            }} // 날짜 클릭 시 함수 호출
          />
        </ContainerItem>
        <ContainerItem>
          <ClockIcon />
          <p className="my-2">참석 일시 투표</p>
          {Array.isArray(selectedDates) &&
            selectedDates.map((date, index) => (
              <DateOption
                key={date instanceof Date ? date.toISOString() : `invalid-date-${index}`}
                date={date}
                onTimeChange={handleTimeChange}
              />
            ))}
          <Button text="투표하기" onClick={handleVote} isLoading={false}></Button>
        </ContainerItem>
      </div>
    </>
  );
};

interface DateOptionProps {
  date: ValuePiece | Value; // date의 타입을 ValuePiece로 변경
  onTimeChange: (date: Value, startTime: Time, endTime: Time) => void;
}

const DateOption = ({ date, onTimeChange }: DateOptionProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const [startTime, setStartTime] = useState<Time>({ hour: 0, minute: 0 });
  const [endTime, setEndTime] = useState<Time>({ hour: 0, minute: 0 });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleStartTimeChange = (hour: number, minute: number) => {
    const newStartTime = { hour, minute };
    setStartTime(newStartTime);
    if (isChecked) onTimeChange(date, newStartTime, endTime);
  };

  const handleEndTimeChange = (hour: number, minute: number) => {
    const newEndTime = { hour, minute };
    setEndTime(newEndTime);
    if (isChecked) onTimeChange(date, startTime, newEndTime);
  };

  return (
    <div
      className={`flex flex-col justify-center items-start mb-2.5 bg-white rounded-[15px] h-[120px] w-[450px] mx-auto p-4 ${!isChecked ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-center mb-2 pointer-events-auto">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600 rounded-full"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span className="mx-2.5">{date instanceof Date ? date.toLocaleDateString() : '날짜없음'}</span>
      </div>
      <div className="flex justify-center items-center space-x-4 mx-auto">
        <TimeSelect onChange={handleStartTimeChange} />
        <p>~</p>
        <TimeSelect onChange={handleEndTimeChange} />
      </div>
    </div>
  );
};

interface TimeSelectProps {
  onChange: (hour: number, minute: number) => void;
}

const TimeSelect = ({ onChange }: TimeSelectProps) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour = parseInt(e.target.value, 10);
    setHour(newHour);
    onChange(newHour, minute);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinute = parseInt(e.target.value, 10);
    setMinute(newMinute);
    onChange(hour, newMinute);
  };

  return (
    <>
      <select
        className="p-2 border border-gray-300 rounded-md bg-white h-10 w-20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        onChange={handleHourChange}
      >
        {Array.from({ length: 24 }, (_, index) => (
          <option key={index} value={index} className="bg-white">
            {formatTime(index)} 시
          </option>
        ))}
      </select>
      <select
        className="p-2 border border-gray-300 rounded-md bg-white h-10 w-20 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        onChange={handleMinuteChange}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <option key={index} value={index * 5} className="bg-white">
            {formatTime(index * 5)} 분
          </option>
        ))}
      </select>
    </>
  );
};

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

const StyledCalendar = styled(Calendar)`
  width: 88%;
  height: 100%;
  background: #f8f8fb;
  border: none;
  border-radius: 10px;
  margin-top: 10px;

  //전체 폰트 컬러
  .react-calendar__month-view {
    abbr {
      color: #15254d;
    }
  }
  //년/월 상단 네비게이션 정렬, 크기 줄이기
  .react-calendar__navigation {
    justify-content: center;
  }
  .react-calendar__navigation__label {
    font-weight: bold; /* 년월을 굵게 표시 */
    color: #2f5fdd;
    flex-grow: 0 !important;
  }
  .react-calendar__navigation:enabled:hover {
    background-color: #5786ff !important;
    border-radius: 5px !important;
  }

  //요일 색, 밑줄
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title='일요일'] {
    color: #ff3629;
  }
  .react-calendar__month-view__weekdays__weekday abbr[title='토요일'] {
    color: #5786ff;
  }
  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: 800;
  }

  //일 스타일
  .react-calendar__tile {
    max-width: initial !important;
    border-radius: 5px; /* 모든 날짜 타일을 동그랗게 */
    cursor: pointer;

    &:hover {
      background: #5786ff;
      color: white;
      border-radius: 5px;
    }
  }
  //일 날짜 간격
  .react-calendar__tile {
    padding: 5px 0px 30px;
    position: relative;
  }
  //일 오늘 날짜
  .react-calendar__tile--now {
    background: none;
    abbr {
      color: #5c76ff;
    }
  }

  /* 클릭 불가능한 날짜 (마우스 오버 또는 포커스 상태) */
  .react-calendar__tile:disabled:hover,
  .react-calendar__tile:disabled:focus {
    background-color: transparent; /* 기본 배경색으로 설정 */
    cursor: not-allowed; /* 커서를 금지 아이콘으로 변경 */
  }

  /* 클릭한 날짜 (마우스 오버 또는 포커스 상태) */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #377bff !important; /* 클릭한 날짜 색상 */
    border-radius: 5px !important;
  }

  /* 클릭된 날짜 (현재 선택된 날짜) */
  .react-calendar__tile--active,
  .selected {
    background-color: #bcd7ff !important; /* 클릭된 날짜 색상 */
    border-radius: 5px !important;
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

export default VoteCalendar;
