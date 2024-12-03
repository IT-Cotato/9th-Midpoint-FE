import { IButton } from './button';
import Arrow from '@/assets/imgs/HomeRe/arrow.svg';

export default function LandingBtn({ text, onClick }: IButton) {
  return (
    <button
      type="submit"
      className={`bg-white rounded-full shadow-base w-72 h-16 text-base flex justify-center items-center `}
      onClick={onClick}
    >
      {text}
      <img src={Arrow} alt="arrow" className="ml-2 w-7 h-7" />
    </button>
  );
}
