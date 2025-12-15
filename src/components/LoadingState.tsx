import { motion } from 'framer-motion';

export const LoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between">
              <div className="h-6 bg-white/20 rounded w-24"></div>
              <div className="h-6 bg-white/20 rounded w-32"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/20 rounded w-1/2"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/20 rounded w-full"></div>
              <div className="h-3 bg-white/20 rounded w-5/6"></div>
            </div>
            <div className="h-8 bg-white/20 rounded w-1/3 ml-auto"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
