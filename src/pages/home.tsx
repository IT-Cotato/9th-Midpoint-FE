import HomeIcon from '@/assets/imgs/home.svg?react';
import styled from 'styled-components';

export default function Home() {
  console.log(import.meta.env.VITE_TEST_DATA); // 환경변수 확인용 코드

  return (
    <>
      <div className="underline">it goes Work!!</div>
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
