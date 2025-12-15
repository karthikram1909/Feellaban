import { motion } from 'framer-motion';
import { Order } from '../services/api';
import { Package, Phone, User } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  index: number;
}

const statusConfig: Record<string, { label: string; gradient: string }> = {
  PENDING_PAYMENT: { label: 'Pending Payment', gradient: 'from-amber-400 to-orange-500' },
  PAYMENT_RECEIVED: { label: 'Payment Received', gradient: 'from-emerald-400 to-teal-500' },
  KITCHEN_MOVED: { label: 'In Kitchen', gradient: 'from-blue-400 to-cyan-500' },
  DELIVERED: { label: 'Delivered', gradient: 'from-green-400 to-emerald-600' },
  CANCELLED: { label: 'Cancelled', gradient: 'from-red-400 to-rose-500' },
};

const defaultConfig = { label: 'Pending', gradient: 'from-gray-400 to-gray-500' };

export const OrderCard = ({ order, index }: OrderCardProps) => {
  const config = statusConfig[order.status] || defaultConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 text-white">
          <User className="w-5 h-5 opacity-90" />
          <span className="text-xl font-bold tracking-wide">{order.customerName}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${config.gradient}`}
        >
          {config.label}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3 text-white/90">
          <Phone className="w-4 h-4 opacity-80" />
          <span className="text-sm font-medium">{order.customerPhone}</span>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="flex items-center gap-2 text-white/70 mb-3">
          <Package className="w-4 h-4" />
          <span className="text-xs font-medium">Items</span>
        </div>
        <div className="space-y-2">
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-white font-semibold text-base">
                {item.quantity}x {item.name}
              </span>
              <span className="text-white/60">${(item.price || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <span className="text-white/70 text-sm font-medium">Total</span>
        <span className="text-white text-xl font-bold">
          ${(order.totalPrice || 0).toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
};
