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
      <div className="bg-slate-100 border border-slate-200 rounded-full p-8 mb-6">
        <Package className="w-16 h-16 text-slate-400" />
      </div>
      <h3 className="text-slate-600 text-xl font-medium mb-2">No orders found</h3>
      <p className="text-slate-500 text-sm">{message}</p>
    </motion.div>
  );
};
