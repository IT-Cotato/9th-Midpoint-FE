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
          {noVotes && <p className="text-[#15254D] mx-auto text-base rounded-2xl">투표한 사람이 없습니다</p>}
          {voteDateInfo.map((memberInfo, memberIndex) => (
            <div
              key={memberIndex}
              className="w-[95%] max-w-[600px] flex flex-row justify-around gap-1 mx-auto mt-1 mb-1 "
            >
              <div className="text-[#5786FF] font-semibold w-[35%] text-center bg-white rounded-[15px] p-3 mx-auto">
                {memberInfo?.memberName}
              </div>
              <div className="w-full text-center bg-white rounded-[15px] p-3 mx-auto ml-2">
                {memberInfo?.dateTime?.map((timeSlot, timeIndex) => {
                  const startTime = timeSlot.memberAvailableStartTime.split(' ')[1];
                  const endTime = timeSlot.memberAvailableEndTime.split(' ')[1];

                  const [startHour, startMinute] = startTime.split(':');
                  const [endHour, endMinute] = endTime.split(':');

                  const formattedStartTime = `${startHour}시 ${startMinute}분`;
                  const formattedEndTime = `${endHour}시 ${endMinute}분`;

                  return (
                    <div key={timeIndex} className="text-center">
                      {formattedStartTime} ~ {formattedEndTime}
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
`;

export default VoteDate;
