import { Link } from 'react-router-dom';

import styled from 'styled-components';

export default function SideBar() {
  return (
    <>
      <SidebarContainer>
        <ul className="flex flex-col gap-2 *:font-semibold">
          <NavItem className="mt-16 transition">
            <Link to="/">Home</Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/map">map</Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/vote">vote</Link>
          </NavItem>
          <NavItem className="transition">
            <Link to="/time">time</Link>
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
  &:hover {
    color: ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.lightPurple};
  }
`;
