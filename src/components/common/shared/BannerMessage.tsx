import { useState } from 'react';
import CopyLogo from '@/assets/imgs/Navbar/copyLogo.svg?react';
import ShareIcon from '@/assets/imgs/Location/sharepin.svg?react'; // 모달 상단의 아이콘을 추가

interface ModalProps {
  url: string;
  onClose: () => void;
  onCopy: () => void;
}

// HTTP 환경에서도 URL 복사 기능을 지원하는 함수
const copyToClipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
};

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('복사 실패', err);
  }
  document.body.removeChild(textArea);
};

export default function BannerMessage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCopyUrl = () => {
    const url = window.location.href;
    copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex items-center justify-center gap-2 p-2 py-5 rounded-lg *:text-lg w-4/5 bg-[#EFF3FF]">
      <CopyLogo />
      <div className="relative">
        상대방에게{' '}
        <span className="text-[#2F5FDD] font-semibold underline cursor-pointer" onClick={handleOpenModal}>
          싱크스팟 링크
        </span>
        를 공유해보세요!
      </div>

      {isModalOpen && (
        <Modal url={window.location.href} onClose={handleCloseModal} onCopy={handleCopyUrl} copied={copied} />
      )}
    </div>
  );
}

const Modal: React.FC<ModalProps & { copied: boolean }> = ({ url, onClose, onCopy, copied }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[90]">
    <div className="bg-white rounded-2xl p-8 w-[490px] h-[490px] flex flex-col items-center shadow-lg gap-3">
      <div className="size-14">
        <ShareIcon />
      </div>
      <h2 className="text-2xl font-semibold text-[#1A3C95]">친구들에게 링크 공유하기</h2>
      <p className="flex flex-col items-center text-[16px] text-gray-600 mb-4">
        <span>링크를 공유하면 내가 입력한 위치에 대한</span>
        <span>중간 지점 찾기 결과를 공유할 수 있어요!</span>
      </p>
      <div className="p-2 mb-8 text-sm break-words bg-gray-100 rounded-lg cursor-not-allowed min-h-10">{url}</div>
      <div className="flex flex-col justify-center w-full gap-4 *:font-semibold">
        <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-400" onClick={onCopy}>
          {copied ? '링크가 복사되었습니다!' : '링크 복사하기'}
        </button>
        <button className="px-4 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  </div>
);
