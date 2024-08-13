import React from 'react';
import styled from 'styled-components';
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';
import CalIcon from '@/assets/imgs/time-calItem-icon1.svg?react';
import ClockIcon from '@/assets/imgs/time-clock-icon.svg?react';
import { DatePickerProps } from './calendar';
import { Value, ValuePiece } from '@/pages/Time/time';

const VoteCalendar: React.FC<DatePickerProps> = ({ selectedDates, onDateChange }) => {
  const handleDateClick = (date: Value) => {
    onDateChange(date);
  };

  return (
    <>
      <div className="flex flex-col item-center justify-center">
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
              !selectedDates ||
              !selectedDates.some(
                (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
              )
            }
            onClickDay={(date) => onDateChange(date)} // 날짜 클릭 시 함수 호출
          />
        </ContainerItem>
      </div>

      <ContainerItem>
        <ClockIcon />
        <p className="my-2">참석 일시 투표</p>
        {Array.isArray(selectedDates) &&
          selectedDates.map((date, index) => (
            <DateOption key={date instanceof Date ? date.toISOString() : `invalid-date-${index}`} date={date} />
          ))}
        {/* : (
          <DateOption key={isDate(selectedDates) ? selectedDates.toISOString() : 'invalid-date'} date={selectedDates} />
        )} */}
      </ContainerItem>
    </>
  );
};

interface DateOptionProps {
  date: ValuePiece | Value; // date의 타입을 ValuePiece로 변경
}

const DateOption = ({ date }: DateOptionProps) => (
  <div className="flex flex-col justify-center items-start mb-2.5 bg-white rounded-[15px] h-[120px] w-[450px] mx-auto p-4">
    <div className="flex items-center mb-2">
      <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded-full" />
      <span className="mx-2.5">{date ? date.toLocaleString() : '날짜없음'}</span>
    </div>
    <div className="flex justify-center items-center space-x-4 mx-auto">
      <TimeSelect />
      <p>~</p>
      <TimeSelect />
    </div>
  </div>
);

const TimeSelect = () => (
  <>
    <select className="p-2 border border-gray-300 rounded bg-white h-10 w-20">
      {Array.from({ length: 24 }, (_, index) => (
        <option key={index} value={index}>
          {index < 10 ? `0${index}` : index} 시
        </option>
      ))}
    </select>
    <select className="p-2 border border-gray-300 rounded bg-white h-10 w-20">
      {Array.from({ length: 12 }, (_, index) => (
        <option key={index} value={index * 5}>
          {index * 5 < 10 ? `0${index * 5}` : index * 5} 분
        </option>
      ))}
    </select>
  </>
);

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
  margin: 0 auto;
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
