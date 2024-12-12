import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';

export default function NotFound() {
  return (
    <Container>
      <Content>
        <header className="w-4/5">
          <nav className="flex items-center justify-between">
            <ul>
              <Link to="/" className="flex items-center gap-2">
                <MainLogo />
                <span className="text-3xl font-semibold">syncspot</span>
              </Link>
            </ul>
          </nav>
        </header>
        <h1>404 존재하지 않는 페이지 입니다</h1>
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
