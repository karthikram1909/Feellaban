import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="backdrop-blur-lg bg-red-500/20 border border-red-400/30 rounded-full p-8 mb-6">
        <AlertCircle className="w-16 h-16 text-red-300" />
      </div>
      <h3 className="text-white/80 text-xl font-medium mb-2">Something went wrong</h3>
      <p className="text-white/60 text-sm mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        Try Again
      </button>
    </motion.div>
  );
};
