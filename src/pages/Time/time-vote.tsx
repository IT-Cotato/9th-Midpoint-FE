import { checkVoteRoom } from '@/apis/time-vote.api';
import VoteCalendar from '@/components/time/vote-calendar';
// import VoteDate from '@/components/time/vote-date';
import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const TimeVote = () => {
  const location = useLocation<ValuePiece[]>();
  const selectedDates = location.state.selectedDates || [];
  const { roomId } = useParams<{ roomId: string }>(); // URL에서 id 파라미터 가져오기

  //처음 접속 시 시간투표방 존재여부 확인하기
  useEffect(() => {
    const verifyRoomExistence = async () => {
      if (!roomId) {
        console.error('방 ID가 정의되지 않았습니다.');
        return; // roomId가 없으면 함수 종료
      }
      try {
        const roomExists = await checkVoteRoom(roomId);
        if (roomExists) {
          console.log('방이 존재합니다.');
          // 방이 존재하는 경우의 추가 로직
        } else {
          console.log('방이 존재하지 않습니다.');
          // 방이 존재하지 않는 경우의 추가 로직
        }
      } catch (error) {
        console.error('방 존재 여부 확인 중 오류 발생:', error);
      }
    };
    verifyRoomExistence();
  }, [roomId]);

  return (
    <TimeVoteStyle>
      <VoteCalendar selectedDates={selectedDates} />
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div``;

export default TimeVote;
