'use client';
import { useEffect, useState } from 'react';
import { MdCheckCircle, MdError, MdClose } from 'react-icons/md';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-xl border font-secondary ${
        type === 'success'
          ? 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30'
          : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
      }`}
      style={{
        animation: isClosing ? 'slideOutRight 0.3s ease-in forwards' : 'slideInBottom 0.4s ease-out',
      }}
    >
      {type === 'success' ? (
        <MdCheckCircle className="text-2xl flex-shrink-0" />
      ) : (
        <MdError className="text-2xl flex-shrink-0" />
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={handleClose}
        className="ml-2 p-1 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex-shrink-0"
        aria-label="Close"
      >
        <MdClose className="text-xl" />
      </button>
      <style jsx>{`
        @keyframes slideInBottom {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
