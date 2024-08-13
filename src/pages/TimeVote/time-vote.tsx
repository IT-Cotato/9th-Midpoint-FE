// import { checkVoteRoom } from '@/apis/time-vote.api';
import VoteCalendar from '@/components/time/vote-calendar';
// import VoteDate from '@/components/time/vote-date';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Value, ValuePiece } from '../Time/time';
import { checkVoteRoom, resultVoteRoom } from '@/apis/time-vote.api';
import { defineRoomType } from '@/components/time/calendar';
import VoteDate from '@/components/time/vote-date';

const TimeVote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [clickedDate, setClickedDate] = useState<ValuePiece>(null);
  const selectedDates: Value[] = location.state?.selectedDates || [];

  const { roomType, roomTypeUrl } = defineRoomType();

  console.log(selectedDates);

  const { roomId } = useParams<{ roomId: string }>(); // URL에서 id 파라미터 가져오기

  //처음 접속 시 시간투표방 존재여부 확인하기
  useEffect(() => {
    const verifyRoomExistence = async () => {
      if (!roomId) {
        console.error('방 ID가 정의되지 않았습니다.');
        return; // roomId가 없으면 함수 종료
      }
      try {
        const roomExists = await checkVoteRoom({ roomId, roomType, navigate });
        if (roomExists) {
          console.log('방이 존재합니다.');
          //selectedDates가 빈배열일 경우 api 호출로 dates 받아오기
          const roomData = await resultVoteRoom({ roomId, roomType, navigate });

          // 응답 데이터 가공
          const { result, totalMemberNum } = roomData.data;
          const formattedDates = Object.keys(result).map((key) => {
            return {
              additionalProp: key,
              members: result[key].map((member: any) => ({
                memberName: member.memberName,
                availableTimes: member.dateTime.map((time: any) => ({
                  startTime: time.memberAvailableStartTime,
                  endTime: time.memberAvailableEndTime,
                })),
              })),
            };
          });
          console.log('가공된 날짜 데이터:', formattedDates);
          console.log('총 투표한 인원:', totalMemberNum);
        } else {
          console.log('방이 존재하지 않습니다.');
          // 방이 존재하지 않는 경우의 추가 로직
          navigate(`/page/${roomId}/${roomTypeUrl}/time`);
        }
      } catch (error) {
        console.error('방 존재 여부 확인 중 오류 발생:', error);
      }

      verifyRoomExistence();
    };
  }, [roomId, roomType, navigate]);

  const handleDateClick = (date: Value | ValuePiece) => {
    // date가 Date 인스턴스인지 확인
    if (date instanceof Date) {
      const isSelected = selectedDates.some(
        (selectedDate) => selectedDate instanceof Date && selectedDate.toDateString() === date.toDateString(),
      );

      if (isSelected) {
        setClickedDate(date); // 클릭한 날짜를 상태에 설정
        console.log(date); // 클릭한 날짜를 콘솔에 출력
      }
    } else {
      // date가 Date가 아닌 경우 추가 처리 (필요시)
      console.warn('클릭한 날짜는 유효한 Date 형식이 아닙니다:', date);
    }
  };

  return (
    <TimeVoteStyle>
      <VoteCalendar selectedDates={selectedDates} onDateChange={handleDateClick} />
      <VoteDate clickedDate={clickedDate} />
    </TimeVoteStyle>
  );
};

const TimeVoteStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default TimeVote;
