import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '@/components/navbar/Navbar';

export default function Layout() {
  return (
    <Container>
      <Navbar />
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100vw;
  max-width: 1440px;
  min-width: 1024px;
  padding-top: 2.5rem;
`;

const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 100vh;
`;
