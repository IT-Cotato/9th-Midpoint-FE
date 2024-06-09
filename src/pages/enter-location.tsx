import SideBar from '@/components/Sidebar';
import { Outlet, useMatch } from 'react-router-dom';
import styled from 'styled-components';

export default function EnterLocation() {
  const locationAloneMatch = useMatch('/enter-location');

  return (
    <Container className="max-w-[1800px]">
      <SideBar />
      <Content>
        <h1 className="text-4xl font-medium pt-9">모두의 중간</h1>
        {!locationAloneMatch && (
          <Textbox className="rounded-lg">
            <p>상대방에게 링크를 공유하여 주소를 입력하게 하고 중간 지점을 찾아보세요!</p>
          </Textbox>
        )}
        <Outlet />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100vw;
  position: relative;
  padding-left: 100px; // Sidebar의 너비가 100px이므로 100px로 수정하였고, Sidebar의 width 변경시 동일하게 변경하면됨
  padding-top: 10px;
`;

const Content = styled.div`
  width: 80%;
  min-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Textbox = styled.div`
  width: 55%;
  min-width: 700px;
  background: rgba(81, 66, 255, 0.1);
  color: ${(props) => props.theme.mainColor};
  padding: 10px 5px;
  font-size: 18px;
  text-align: center;
`;
