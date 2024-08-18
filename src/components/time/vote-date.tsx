import { ValuePiece } from '@/pages/Time/time';
import { VoteDateInfo } from '@/pages/TimeVote/time-vote';
import styled from 'styled-components';

const VoteDate = ({
  clickedDate,
  voteDateInfo,
  noVotes,
}: {
  clickedDate: ValuePiece | null;
  voteDateInfo: VoteDateInfo[];
  noVotes: boolean;
}) => {
  return (
    <VoteDateStyle>
      {clickedDate && (
        <DateInfo>
          {noVotes && <p className="text-[#5786FF] mx-auto">투표한 사람이 없습니다</p>}
          {voteDateInfo.map((memberInfo, memberIndex) => (
            <div
              key={memberIndex}
              className="text-[#5786FF] w-11/12 max-w-[600px] flex flex-row justify-around mx-auto mt-1 mb-1 "
            >
              <div className="w-[30%] text-center bg-white rounded-[15px] p-3 mx-auto">{memberInfo?.memberName}</div>
              <div className="w-[60%] text-center bg-white rounded-[15px] p-3 mx-auto">
                {memberInfo?.dateTime?.map((timeSlot, timeIndex) => {
                  const startTime = timeSlot.memberAvailableStartTime.split(' ')[1];
                  const endTime = timeSlot.memberAvailableEndTime.split(' ')[1];

                  return (
                    <div key={timeIndex} className="text-center">
                      {startTime} ~ {endTime}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </DateInfo>
      )}
    </VoteDateStyle>
  );
};

const VoteDateStyle = styled.div``;

const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px 0;
  background: #f8f8fb;
  padding: 10px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
`;

export default VoteDate;
