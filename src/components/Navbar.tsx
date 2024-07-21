import MainLogo from '@/assets/imgs/Navbar/mainLogo.svg?react';
import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { loginAtom } from '@/stores/login-state';

export default function Navbar() {
  const isLogin = useAtomValue(loginAtom);

  return (
    <header className="w-4/5">
      <nav className="flex items-center justify-between">
        <ul>
          <Link to="/" className="flex items-center gap-2">
            <MainLogo />
            <span className="text-4xl font-semibold">ASAP</span>
          </Link>
        </ul>
        {!isLogin && (
          <ul className="flex items-center gap-6 *:cursor-pointer">
            <li>중간지점찾기</li>
            <li>투표만들기</li>
            <li>모임시간정하기</li>
          </ul>
        )}
      </nav>
    </header>
  );
}
