import { Link, useLocation } from 'react-router-dom';

import HomeLogo from '@/assets/imgs/Navbar/home-logo.svg?react';
// import HomeLogoActive from '@/assets/imgs/Navbar/home-logo-active.svg?react';
import PinLogo from '@/assets/imgs/Navbar/pin-logo.svg?react';
import VoteLogo from '@/assets/imgs/Navbar/vote-logo.svg?react';
import ClockLogo from '@/assets/imgs/Navbar/clock-logo.svg?react';

import styled from 'styled-components';

interface LogoProps {
  active: boolean;
}

export default function SideBar() {
  const location = useLocation();
  return (
    <>
      <SidebarContainer>
        <ul className="flex flex-col gap-2 *:font-semibold">
          <NavItem className="mt-16 transition">
            <Link to="/">
              <Logo active={location.pathname === '/'}>
                {/* {location.pathname === '/' ? <HomeLogoActive /> : <HomeLogo />} */}
                <HomeLogo />
              </Logo>
            </Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/midpoint">
              <Logo active={location.pathname === '/midpoint'}>
                <PinLogo />
              </Logo>
            </Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/vote">
              <Logo active={location.pathname === '/vote'}>
                <VoteLogo />
              </Logo>
            </Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/time">
              <Logo active={location.pathname === '/time'}>
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

const Logo = styled.span<LogoProps>`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 100%;
  display: block;
  margin: 0 auto;
  background-color: ${({ active }) => (active ? 'white' : 'transparent')};
`;
