import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-full p-8 mb-6">
        <Package className="w-16 h-16 text-white/40" />
      </div>
      <h3 className="text-white/80 text-xl font-medium mb-2">No orders found</h3>
      <p className="text-white/60 text-sm">{message}</p>
    </motion.div>
  );
};
