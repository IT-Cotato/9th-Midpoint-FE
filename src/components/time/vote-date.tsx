import styled from 'styled-components';

const VoteDate = (clickedDate: any) => {
  return (
    <VoteDateStyle>
      {clickedDate && (
        <DateInfo>
          <div className="bg-white rounded-[15px] text-[#5786FF] p-4 w-full max-w-[100px] mx-auto">닉네임</div>
          <div className="bg-white rounded-[15px] text-[#5786FF] p-4 w-full max-w-[300px] mx-auto">
            00시 00분 ~ 24시 00분
          </div>
        </DateInfo>
      )}
    </VoteDateStyle>
  );
};

const VoteDateStyle = styled.div``;

const DateInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 20px 0; // 추가된 간격
  background: #f8f8fb;
  padding: 10px 5px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
`;

export default VoteDate;
