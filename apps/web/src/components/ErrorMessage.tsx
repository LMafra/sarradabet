interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
    <div className="text-red-500 text-xl">{message}</div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
      >
        Tentar Novamente
      </button>
    )}
  </div>
);

export default ErrorMessage;
