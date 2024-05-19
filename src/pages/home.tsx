import styled from 'styled-components';
import Sidebar from '../components/Sidebar';

export default function Home() {
  console.log(import.meta.env.VITE_TEST_DATA); // 환경변수 확인용 코드

  return (
    <Container>
      <Sidebar />
      <Content>
        <div>
          <Title>모두의 중간</Title>
          <Textbox>
            <p>상대방에게 링크를 공유하여 주소를 입력하게 하고 중간 지점을 찾아보세요!</p>
          </Textbox>
        </div>
      </Content>
    </Container>
  );
}

const Title = styled.h1`
  font-size: 40px;
  text-align: center;
`;

const Textbox = styled.div`
  margin-top: 10px;
  width: 50vw;
  background-color: #5142ff;
  padding: 1rem;
  border-radius: 8px;

  font-size: 20px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  margin-top: 30px;
  flex: 1;
  padding: 1rem;
`;
