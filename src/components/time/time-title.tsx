// import React from 'react';
import styled from 'styled-components';

import VoteIcon from '@/assets/imgs/time-vote-icon.svg?react';
import CalIcon from '@/assets/imgs/time-cal-icon.svg?react';

const vote = () => {
  return (
    <Textbox>
      <VoteIconStyled />
      투표를 생성할 날짜를 <ColoredText>모두 골라주세요!</ColoredText>
      <CalIconStyle />
      모임에 <ColoredText>참석 가능한 날짜를 선택한 후, 참석 가능 시간을 기입</ColoredText>해주세요!
    </Textbox>
  );
};

const VoteIconStyled = styled(VoteIcon)`
  margin-right: 8px;
`;
const CalIconStyle = styled(CalIcon)`
  margin-right: 8px;
`;

const Textbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 1000px;
  min-height: 60px;
  background: rgba(81, 66, 255, 0.1);
  padding: 5px 5px;
  margin: 0 auto;
  border-radius: 15px;
  font-size: 18px;
  text-align: center;
  font-weight: bold;
`;
const ColoredText = styled.span`
  margin-left: 5px;
  color: #2f5fdd;
`;

export default vote;
