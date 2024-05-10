import HomeIcon from '@/assets/imgs/home.svg?react';
import styled from 'styled-components';

export default function Home() {
  console.log(import.meta.env.VITE_TEST_DATA); // 환경변수 확인용 코드

  return (
    <>
      <div>
        <h1>CI / CD 구축 완료 및 배포자동화완료!</h1>
        <p>DNS 테스트 코드 123</p>
      </div>
      <Title>Home</Title>
      <HomeSvg />
    </>
  );
}

const Title = styled.h1`
  font-size: 22px;
`;

const HomeSvg = styled(HomeIcon)`
  width: 50px;
  height: 50px;
`;
