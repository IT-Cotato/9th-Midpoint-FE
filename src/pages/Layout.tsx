import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import BannerMessage from '@/components/BannerMessage';

export default function Layout() {
  return (
    <Container>
      <Content>
        <Navbar />
        <BannerMessage />
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
  padding-top: 30px;
`;

const Content = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 100vh;
`;
