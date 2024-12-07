export interface IButton {
  text: string;
  theme?: 'login' | 'add';
  isLoading?: boolean;
  isMoreMessage?: string;
  isMore?: boolean;
  onClick?: () => void;
}

export default function Button({
  text,
  theme,
  isLoading,
  isMoreMessage,
  isMore,
  onClick,
}: IButton) {
  return (
    <button
      type="submit"
      className={`min-h-14 w-[450px] primary-btn rounded-2xl text-menu text-center cursor-pointer
        ${theme === 'login' ? 'primary-btn' : ''}
        ${theme === 'add' ? 'add-btn' : ''}
        disabled:grayNormal disabled:cursor-not-allowed 
        `}
      disabled={isLoading || isMore}
      onClick={onClick}
    >
      {isMore ? isMoreMessage : isLoading ? '잠시만 기다려주세요...' : text}
    </button>
  );
}
