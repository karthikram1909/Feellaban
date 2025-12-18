import axios from 'axios';

const BASE_URL = 'https://one.2440066.xyz/feellaban-api';

export const setupAxiosInterceptors = (onUnauthorized: () => void) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        onUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_RECEIVED'
  | 'KITCHEN_MOVED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

interface RawOrderItem {
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface RawOrder {
  id: number;
  customer_name: string;
  phone_number: string;
  order_status: OrderStatus;
  items: RawOrderItem[];
  grand_total: string;
  created_at: string;
}

const mapOrder = (raw: RawOrder): Order => ({
  id: raw.id.toString(),
  status: raw.order_status,
  customerName: raw.customer_name,
  customerPhone: raw.phone_number,
  items: raw.items.map(item => ({
    name: item.product_name,
    quantity: item.quantity,
    price: item.price
  })),
  totalPrice: parseFloat(raw.grand_total),
  createdAt: raw.created_at,
});

export const fetchOrdersByStatus = async (status: OrderStatus): Promise<Order[]> => {
  try {
    const response = await axios.get<RawOrder[]>(`${BASE_URL}/api/orders`, {
      params: { status },
    });
    return response.data.map(mapOrder);
  } catch (error) {
    console.error(`Error fetching orders for status ${status}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  try {
    await axios.put(`${BASE_URL}/api/orders/${orderId}/status`, { status });
  } catch (error) {
    console.error(`Error updating order ${orderId} status to ${status}:`, error);
    throw error;
  }
};

export const fetchAllOrders = async (): Promise<{
  [key in OrderStatus]: Order[];
}> => {
  const statuses: OrderStatus[] = [
    'PENDING_PAYMENT',
    'PAYMENT_RECEIVED',
    'KITCHEN_MOVED',
    'DELIVERED',
    'CANCELLED',
  ];

  const results = await Promise.all(
    statuses.map(status =>
      fetchOrdersByStatus(status)
        .then(orders => ({ status, orders }))
        .catch(() => ({ status, orders: [] }))
    )
  );

  return results.reduce((acc, { status, orders }) => {
    acc[status] = orders;
    return acc;
  }, {} as { [key in OrderStatus]: Order[] });
};

export const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/login`, { username, password });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw error;
  }
};
