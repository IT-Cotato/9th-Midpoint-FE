import { Link } from 'react-router-dom';

import HomeLogo from '@/assets/imgs/Icons/home-logo.svg?react';
import PinLogo from '@/assets/imgs/Icons/pin-logo.svg?react';
import VoteLogo from '@/assets/imgs/Icons/vote-logo.svg?react';
import ClockLogo from '@/assets/imgs/Icons/clock-logo.svg?react';

import styled from 'styled-components';

export default function SideBar() {
  return (
    <>
      <SidebarContainer>
        <ul className="flex flex-col gap-2 *:font-semibold">
          <NavItem className="mt-16 transition">
            <Link to="/">
              <Logo>
                <HomeLogo />
              </Logo>
            </Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/map">
              <Logo>
                <PinLogo />
              </Logo>
            </Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/vote">
              <Logo>
                <VoteLogo />
              </Logo>
            </Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/time">
              <Logo>
                <ClockLogo />
              </Logo>
            </Link>
          </NavItem>
        </ul>
      </SidebarContainer>
    </>
  );
}

const SidebarContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  min-width: 120px;
  background-color: #5142ff;
  color: white;
`;

const NavItem = styled.li`
  text-transform: uppercase;
  cursor: pointer;
  padding: 1rem;
`;

const Logo = styled.span`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 100%;
`;
