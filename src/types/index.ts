export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  shortDescription: string;
  specifications: Record<string, string>;
  features: string[];
  images: string[];
  stock: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image?: string;
  icon?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  joinedAt: string;
  lastOrderAt?: string;
}

export interface DashboardMetrics {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  customers: number;
  customersChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}
