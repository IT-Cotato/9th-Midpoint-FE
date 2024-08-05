import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CopyLogo from '@/assets/imgs/Navbar/copyLogo.svg?react';

export default function BannerMessage() {
  const [copied, setCopied] = useState(false);
  // url에 따라 안에 배너 메세지 수정하는 로직 추가 필요
  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  return (
    <Textbox className="flex items-center justify-center gap-2 p-2 py-5 rounded-lg *:text-lg">
      <CopyLogo />
      <div className="relative">
        <AnimatePresence>
          {copied && (
            <CopiedMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              링크가 복사되었습니다
            </CopiedMessage>
          )}
        </AnimatePresence>
        상대방에게{' '}
        <span className="text-[#2F5FDD] font-semibold underline cursor-pointer" onClick={handleCopy}>
          싱크스팟 링크
        </span>
        를 공유해보세요!
      </div>
    </Textbox>
  );
}

const Textbox = styled.div`
  width: 80%;
  background: ${(props) => props.theme.bgColor};
`;

const CopiedMessage = styled(motion.div)`
  position: absolute;
  bottom: 150%;
  left: 20%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  width: max-content;
`;
