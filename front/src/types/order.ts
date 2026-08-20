export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  items: OrderItemInput[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
}
