import HomeBg from '@/assets/imgs/HomeRe/LandingBg.png';
import LandingBtn from '@/components/common/Button/landingBtn';
import Navbar from '@/components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';

export default function HomeRe() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        backgroundImage: `url(${HomeBg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
      }}
      className="w-full h-screen "
    >
      <div className="flex flex-col items-center justify-center pt-10 m-auto">
        <Navbar />
      </div>
      <div className="fixed bottom-16 right-16">
        <LandingBtn
          text="모임장소 찾으러 가기"
          onClick={() => navigate(`/page/login`)}
        />
      </div>
    </div>
  );
}
