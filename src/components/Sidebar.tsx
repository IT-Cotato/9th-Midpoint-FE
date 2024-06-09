import HomeLogo from '@/assets/imgs/Navbar/home-logo.svg?react';
import PinLogo from '@/assets/imgs/Navbar/pin-logo.svg?react';
import VoteLogo from '@/assets/imgs/Navbar/vote-logo.svg?react';
import ClockLogo from '@/assets/imgs/Navbar/clock-logo.svg?react';
import styled from 'styled-components';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// 메뉴 enum 정의
enum Menu {
  Home = 'home',
  Pin = 'pin',
  Vote = 'vote',
  Clock = 'clock',
}

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleMenuClick = (menu: Menu) => {
    setIsOpen(true);
    setSelectedMenu(menu);
  };

  const handleCloseSidebar = () => {
    setIsOpen(false);
    setSelectedMenu(null);
  };

  return (
    <>
      <SidebarContainer>
        <ul>
          <NavItem className="transition" onClick={() => handleMenuClick(Menu.Home)}>
            <Logo>
              <HomeLogo />
            </Logo>
          </NavItem>
          <NavItem className="transition" onClick={() => handleMenuClick(Menu.Pin)}>
            <Logo>
              <PinLogo />
            </Logo>
          </NavItem>
          <NavItem className="transition" onClick={() => handleMenuClick(Menu.Vote)}>
            <Logo>
              <VoteLogo />
            </Logo>
          </NavItem>
          <NavItem className="transition" onClick={() => handleMenuClick(Menu.Clock)}>
            <Logo>
              <ClockLogo />
            </Logo>
          </NavItem>
        </ul>
      </SidebarContainer>
      <AnimatePresence initial={false}>
        {isOpen && (
          <Content
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            <CloseButton onClick={handleCloseSidebar}>Close</CloseButton>
            {selectedMenu === Menu.Home && <p>Home Content</p>}
            {selectedMenu === Menu.Pin && <p>Pin Content</p>}
            {selectedMenu === Menu.Vote && <p>Vote Content</p>}
            {selectedMenu === Menu.Clock && <p>Clock Content</p>}
          </Content>
        )}
      </AnimatePresence>
    </>
  );
}

const SidebarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100px;
  background-color: #5142ff;
  color: white;
  z-index: 1000;
  padding-top: 50px;
`;

const NavItem = styled.li`
  text-transform: uppercase;
  cursor: pointer;
  padding: 1rem;
  list-style: none;
  text-align: center;
`;

const Logo = styled.span`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 100%;
  display: block;
  margin: 0 auto;
`;

const Content = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 100px;
  height: 100vh;
  width: 350px;
  background-color: white;
  z-index: 999;
  padding: 1rem;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #5142ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #524abd;
  }
`;
