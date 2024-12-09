import styled from 'styled-components';
import { useState } from 'react';

import FristCalendar from '@/components/TimeVote/calendar';
import { Value, ValuePiece } from '@/types/time-vote';

const TimeCreate: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<ValuePiece[]>([]);
  const [isValue, setIsValue] = useState(true);

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDates((prev) => {
        const newSelectedDates =
          prev.length === 0
            ? [value] // 첫 번째 날짜 추가
            : prev.some((date) => date?.toDateString() === value.toDateString())
              ? prev.filter(
                  (date) => date?.toDateString() !== value.toDateString(),
                ) // 날짜가 이미 존재하면 제거
              : [...prev, value]; // 날짜가 존재하지 않으면 추가

        // 날짜가 7개를 초과하는 경우
        if (newSelectedDates.length > 7) {
          alert('날짜는 7개까지 선택할 수 있습니다');
          return prev;
        }

        setIsValue(newSelectedDates.length === 0);
        return newSelectedDates;
      });
    }
  };

  return (
    <Container>
      <FristCalendar
        isValue={isValue}
        selectedDates={selectedDates}
        onDateChange={handleDateChange}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 80%;
  // border: 1px solid red;
`;

export default TimeCreate;
