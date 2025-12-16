import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderCard } from './OrderCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { fetchAllOrders, updateOrderStatus, Order, OrderStatus } from '../services/api';
import { User, LogOut, ChevronDown, UserCircle } from 'lucide-react';

const statusConfigs = [
  {
    status: 'PENDING_PAYMENT' as OrderStatus,
    title: 'Pending Payment',
  },
  {
    status: 'KITCHEN_MOVED' as OrderStatus,
    title: 'In Kitchen',
  },
  {
    status: 'DELIVERED' as OrderStatus,
    title: 'Delivered',
  },
  {
    status: 'CANCELLED' as OrderStatus,
    title: 'Cancelled',
  },
];

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [orders, setOrders] = useState<{ [key in OrderStatus]: Order[] }>({
    PENDING_PAYMENT: [],
    PAYMENT_RECEIVED: [],
    KITCHEN_MOVED: [],
    DELIVERED: [],
    CANCELLED: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>('PENDING_PAYMENT');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status. Please try again.');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getDisplayOrders = (): Order[] => {
    if (selectedStatus) {
      return orders[selectedStatus];
    }
    return Object.values(orders).flat();
  };

  const displayOrders = getDisplayOrders();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-blue-600 shadow-lg sticky top-0 z-30 mb-8">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 h-20 flex items-center justify-center relative">
          <div className="flex items-center gap-4">
            <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src="/logo.png" 
              alt="Feel Laban" 
              className="h-12 md:h-14 object-contain"
            />
            <h1 className="text-white text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Feel Laban
            </h1>
          </div>

          <div className="absolute right-4 md:right-8 lg:right-12" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm"
              title="Profile"
            >
              <User className="w-6 h-6" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-semibold text-slate-800">Admin</p>
                    {/* <p className="text-xs text-slate-500">owner@feellaban.com</p> */}
                  </div>
                  
                  {/* <button className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors">
                    <UserCircle className="w-4 h-4" />
                    My Profile
                  </button>
                   */}
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-xl shadow-inner">
            {statusConfigs.map((config) => {
              const isActive = selectedStatus === config.status;
              return (
                <button
                  key={config.status}
                  onClick={() => setSelectedStatus(config.status)}
                  className={`
                    px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-500 hover:text-slate-700'
                    }
                  `}
                >
                  {config.title}
                  <span className={`ml-2 text-xs py-0.5 px-2 rounded-full ${isActive ? 'bg-slate-100 text-slate-600' : 'bg-slate-200 text-slate-500'}`}>
                    {orders[config.status].length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={loadOrders} />
        ) : displayOrders.length === 0 ? (
          <EmptyState
            message={
              selectedStatus
                ? `No orders with status: ${selectedStatus.replace(/_/g, ' ').toLowerCase()}`
                : 'No orders available at the moment'
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayOrders.map((order, index) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                index={index} 
                onUpdateStatus={handleStatusUpdate}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
