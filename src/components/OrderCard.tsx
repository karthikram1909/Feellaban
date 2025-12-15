import { motion } from 'framer-motion';
import { Order, OrderStatus } from '../services/api';
import { Package, Phone, User, CheckCircle, ChefHat, Truck, XCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  index: number;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const statusConfig: Record<string, { label: string; gradient: string }> = {
  PENDING_PAYMENT: { label: 'Pending Payment', gradient: 'from-amber-400 to-orange-500' },
  PAYMENT_RECEIVED: { label: 'Payment Received', gradient: 'from-emerald-400 to-teal-500' },
  KITCHEN_MOVED: { label: 'In Kitchen', gradient: 'from-blue-400 to-cyan-500' },
  DELIVERED: { label: 'Delivered', gradient: 'from-green-400 to-emerald-600' },
  CANCELLED: { label: 'Cancelled', gradient: 'from-red-400 to-rose-500' },
};

const defaultConfig = { label: 'Pending', gradient: 'from-gray-400 to-gray-500' };

export const OrderCard = ({ order, index, onUpdateStatus }: OrderCardProps) => {
  const config = statusConfig[order.status] || defaultConfig;

  const getNextAction = () => {
    switch (order.status) {
      case 'PENDING_PAYMENT':
        return { label: 'Mark Paid', status: 'KITCHEN_MOVED' as OrderStatus, icon: CheckCircle, color: 'bg-emerald-500 hover:bg-emerald-600' };
      case 'KITCHEN_MOVED':
        return { label: 'Delivered', status: 'DELIVERED' as OrderStatus, icon: Truck, color: 'bg-green-500 hover:bg-green-600' };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();
  const showCancel = ['PENDING_PAYMENT', 'PAYMENT_RECEIVED', 'KITCHEN_MOVED'].includes(order.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white border border-black rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 text-slate-800">
          <User className="w-5 h-5 text-slate-500" />
          <span className="text-xl font-bold tracking-wide">{order.customerName}</span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${config.gradient}`}
        >
          {config.label}
        </span>
      </div>

      <div className="space-y-3 mb-4 flex-grow">
        <div className="flex items-center gap-3 text-slate-600">
          <Phone className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{order.customerPhone}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 mb-4">
        <div className="flex items-center gap-2 text-slate-500 mb-3">
          <Package className="w-4 h-4" />
          <span className="text-xs font-medium">Items</span>
        </div>
        <div className="space-y-2">
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span className="text-slate-800 font-semibold text-base">
                {item.quantity}x {item.name}
              </span>
              <span className="text-slate-500">${(item.price || 0).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100 mb-6">
        <span className="text-slate-500 text-sm font-medium">Total</span>
        <span className="text-slate-900 text-xl font-bold">
          ${(order.totalPrice || 0).toFixed(2)}
        </span>
      </div>

      {(nextAction || showCancel) && (
        <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
          {nextAction && (
            <button
              onClick={() => onUpdateStatus(order.id, nextAction.status)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-sm text-white font-medium transition-colors ${nextAction.color}`}
            >
              <nextAction.icon className="w-3.5 h-3.5" />
              {nextAction.label}
            </button>
          )}
          {showCancel && (
            <button
              onClick={() => onUpdateStatus(order.id, 'CANCELLED')}
              className="px-2 py-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Cancel Order"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
