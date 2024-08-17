//import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

import FristCalendar from '@/components/time/calendar';

export type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

const Time: React.FC = () => {
  const [selectedDates, setSelectedDates] = useState<ValuePiece[]>([]);

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDates((prev) => {
        const dateExists = prev.some((date) => date?.toDateString() === value.toDateString());
        if (dateExists) {
          return prev.filter((date) => date?.toDateString() !== value.toDateString());
        } else {
          return [...prev, value];
        }
      });
    }
  };

  return (
    <Container>
      <Content>
        <GridBox>
          <FristCalendar selectedDates={selectedDates} onDateChange={handleDateChange} />
        </GridBox>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 80%;
  // border: 1px solid red;
`;

const Content = styled.div`
  width: auto;
  min-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GridBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  justify-content: flex-start;
  margin: -10px;
`;

export default Time;
