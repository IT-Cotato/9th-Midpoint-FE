// import React from 'react';
import styled from 'styled-components';
import SideBar from '@/components/Sidebar';

const vote = () => {
  return (
    <Container className="max-w-[1800px]">
      <SideBar />
      <Content>
        <div>
          <h1>vote Page</h1>
          <p>This is the vote page.</p>
        </div>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100vw;
`;

const Content = styled.div`
  width: 80%;
  min-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

export default vote;
