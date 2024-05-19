import { Link } from 'react-router-dom';

import HomeIcon from '@/assets/imgs/home.svg?react';
import styled from 'styled-components';

export default function sidebar() {
  return (
    <>
      <SidebarContainer>
        <ul className="space-y-2">
          <NavItem>
            <Link to="/">
              <HomeSvg className="inline-block mr-2" />
              Home
            </Link>
          </NavItem>
          <NavItem>
            <Link to="/map">map</Link>
          </NavItem>
          <NavItem>
            <Link to="/vote">vote</Link>
          </NavItem>
          <NavItem>
            <Link to="/time">time</Link>
          </NavItem>
        </ul>
      </SidebarContainer>
    </>
  );
}

const HomeSvg = styled(HomeIcon)`
  width: 50px;
  height: 50px;
`;

const SidebarContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 10vw;
  background-color: #5142FF;
  color: white;
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

const NavItem = styled.li`
  padding: 1rem;
  &:hover {
    background-color: #374151;
  }
`;