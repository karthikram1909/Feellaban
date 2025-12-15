import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatusCardProps {
  icon: string;
  title: string;
  count: number;
  gradient: string;
  isActive: boolean;
  onClick: () => void;
  delay: number;
}

export const StatusCard = ({
  icon,
  title,
  count,
  gradient,
  isActive,
  onClick,
  delay,
}: StatusCardProps) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = count / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={`
        relative cursor-pointer overflow-hidden rounded-2xl p-6
        shadow-lg transition-all duration-300 bg-gradient-to-br ${gradient}
        ${isActive ? 'ring-4 ring-blue-300 scale-105' : 'hover:scale-105'}
      `}
    >
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-white/90 text-sm font-medium mb-2">{title}</h3>
        <div className="text-3xl font-bold text-white">
          {displayCount}
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 text-8xl opacity-10">
        {icon}
      </div>
    </motion.div>
  );
};
