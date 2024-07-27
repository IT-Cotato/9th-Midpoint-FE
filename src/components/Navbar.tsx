import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="w-4/5">
      <nav className="flex items-center justify-between">
        <ul>
          <Link to="/" className="flex items-center gap-2">
            <MainLogo />
            <span className="text-3xl font-semibold">Syncspot</span>
          </Link>
        </ul>
        <ul className="flex items-center gap-6 *:cursor-pointer">
          <li>중간지점찾기</li>
          <li>장소투표</li>
          <li>시간투표</li>
        </ul>
      </nav>
    </header>
  );
}
