import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import CopyLogo from '@/assets/imgs/Navbar/copyLogo.svg?react';

export default function BannerMessage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  return (
    <Textbox className="flex items-center justify-center gap-2 p-2 py-5 rounded-lg">
      <CopyWrapper>
        <CopyLogo className="cursor-pointer" onClick={handleCopy} />
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
      </CopyWrapper>
      <span className="text-lg">
        상대방에게 <span className="text-[#2F5FDD] font-semibold">ASAP 링크를 공유해 위치를 입력</span>
        하고 중간 지점을 찾아보세요!
      </span>
    </Textbox>
  );
}

const Textbox = styled.div`
  width: 80%;
  background: ${(props) => props.theme.bgColor};
`;

const CopyWrapper = styled.div`
  position: relative;
`;

const CopiedMessage = styled(motion.div)`
  position: absolute;
  bottom: 150%;
  left: 50%;
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
