interface IButton {
  text: string;
  isLoading: boolean;
}

export default function Button({ text, isLoading }: IButton) {
  return (
    <button
      type="submit"
      className="min-h-10 primary-btn disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {isLoading ? '잠시만 기다려 주세요...' : text}
    </button>
  );
}
