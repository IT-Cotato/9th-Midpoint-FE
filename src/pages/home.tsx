import HomeIcon from '@/assets/imgs/home.svg?react';
import styled from 'styled-components';

export default function Home() {
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
