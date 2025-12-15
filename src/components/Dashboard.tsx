import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { StatusCard } from './StatusCard';
import { OrderCard } from './OrderCard';
import { LoadingState } from './LoadingState';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { fetchAllOrders, Order, OrderStatus } from '../services/api';

const statusConfigs = [
  {
    status: 'PENDING_PAYMENT' as OrderStatus,
    icon: '🕒',
    title: 'Pending Payment',
    gradient: 'rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.9)',
  },
  {
    status: 'PAYMENT_RECEIVED' as OrderStatus,
    icon: '💳',
    title: 'Payment Received',
    gradient: 'rgba(52, 211, 153, 0.8), rgba(16, 185, 129, 0.9)',
  },
  {
    status: 'KITCHEN_MOVED' as OrderStatus,
    icon: '👨‍🍳',
    title: 'Kitchen Moved',
    gradient: 'rgba(96, 165, 250, 0.8), rgba(59, 130, 246, 0.9)',
  },
  {
    status: 'DELIVERED' as OrderStatus,
    icon: '🚚',
    title: 'Delivered',
    gradient: 'rgba(74, 222, 128, 0.8), rgba(34, 197, 94, 0.9)',
  },
  {
    status: 'CANCELLED' as OrderStatus,
    icon: '❌',
    title: 'Cancelled',
    gradient: 'rgba(248, 113, 113, 0.8), rgba(239, 68, 68, 0.9)',
  },
];

const themes = [
  { name: 'Sunset', gradient: 'from-orange-500 via-amber-500 to-yellow-500' },
  { name: 'Ocean', gradient: 'from-blue-600 via-teal-500 to-emerald-500' },
  { name: 'Berry', gradient: 'from-pink-600 via-purple-600 to-indigo-600' },
  { name: 'Midnight', gradient: 'from-slate-900 via-purple-900 to-slate-900' },
];

export const Dashboard = () => {
  const [orders, setOrders] = useState<{ [key in OrderStatus]: Order[] }>({
    PENDING_PAYMENT: [],
    PAYMENT_RECEIVED: [],
    KITCHEN_MOVED: [],
    DELIVERED: [],
    CANCELLED: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [currentTheme, setCurrentTheme] = useState(0);

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
    <div className="min-h-screen relative overflow-hidden transition-colors duration-700">
      <div className={`absolute inset-0 bg-gradient-to-br ${themes[currentTheme].gradient} transition-all duration-700`}></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 px-4 py-8 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-3 bg-gradient-to-r from-white via-pink-100 to-purple-100 text-transparent bg-clip-text">
            Feellaban
          </h1>
          <p className="text-white/70 text-lg md:text-xl font-light">
            Feel the flow of orders
          </p>
          <div className="absolute right-0 top-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentTheme((prev) => (prev + 1) % themes.length)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
              title="Change Theme"
            >
              <Palette className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {statusConfigs.map((config, index) => (
            <StatusCard
              key={config.status}
              icon={config.icon}
              title={config.title}
              count={orders[config.status].length}
              gradient={config.gradient}
              isActive={selectedStatus === config.status}
              onClick={() =>
                setSelectedStatus(
                  selectedStatus === config.status ? null : config.status
                )
              }
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="mb-6">
          {selectedStatus && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedStatus(null)}
              className="backdrop-blur-lg bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all duration-300 font-medium"
            >
              ← Show All Orders
            </motion.button>
          )}
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
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};
