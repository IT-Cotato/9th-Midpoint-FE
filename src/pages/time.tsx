//import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

import Calendar from '@/components/time/calendar';
import VoteCalendar from '@/components/time/vote-calendar';

export interface CalendarProps {
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

const Time = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  return (
    <Container>
      <Content>
        <GridBox>
          {selectedDates.length > 0 ? (
            <VoteCalendar selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
          ) : (
            <Calendar setSelectedDates={setSelectedDates} />
          )}
        </GridBox>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 80%;
  border: 1px solid red;
`;

const Content = styled.div`
  width: 70%;
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
  // justify-content: center;
  justify-content: flex-start;
  margin: -10px;
`;

export default Time;
