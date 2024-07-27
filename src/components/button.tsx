interface IButton {
  text: string;
  isLoading: boolean;
  isMoreMessage?: string;
  isMore?: boolean;
  onClick?: () => void;
}

export default function Button({ text, isLoading, isMoreMessage, isMore, onClick }: IButton) {
  return (
    <button
      type="submit"
      className="min-h-10 primary-btn disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={isLoading || isMore}
      onClick={onClick}
    >
      {isMore ? isMoreMessage : isLoading ? '잠시만 기다려주세요...' : text}
    </button>
  );
}
