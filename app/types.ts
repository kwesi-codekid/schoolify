export type ProductInterface = {
  _id: string; //Types.ObjectId
  name: string;
  description: string;
  quantity: number;
  quantitySold: number;
  costPrice: number;
  price: number;
  images: ImageInterface[];
  category: CategoryInterface;
  availability: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ImageInterface = {
  _id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryInterface = {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminInterface = {
  _id: string;
  username: string;
  email: string;
  role?: string;
  permissions?: [{ name: string; action: string }];
  createdAt: Date;
  updatedAt: Date;
};

export type UserInterface = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  profileImage: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CustomerInterface = {
  _id: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PageInterface = {
  children: React.ReactNode;
  user?: AdminInterface | UserInterface | EmployeeInterface;
  title?: string;
  message?: {
    type: "success" | "error";
    message: string;
  };
};

export type EmployeeInterface = {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  role?: string;
  status: string;
  password: string;
  permissions?: [{ name: string; action: string }];
  createdAt: Date;
  updatedAt: Date;
};

export type CartInterface = {
  _id: string;
  user: string;
  product: ProductInterface;
  quantity: number;
  color: number;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderInterface = {
  _id: string;
  orderId: string;
  orderItems: CartInterface[];
  totalPrice: number;
  deliveryStatus: string;
  status: string;
  user: UserInterface;
  shippingAddress: AddressInterface;
  paymentInfo: PaymentInterface;
  orderType: "delivery" | "pickup";
  isShop: boolean;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type AddressInterface = {
  _id: string;
  user: UserInterface;
  title: string;
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  default: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PaymentInterface = {
  _id: string;
  orderId: OrderInterface;
  paymentMode: "cash" | "card" | "momo" | "cheque";
  phoneNumber: string;
  cardNumber: string;
  status: "pending" | "paid";
  createdAt: Date;
  updatedAt: Date;
};

export type EmailHistoryInterface = {
  _id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  storeName: string;
};

export type SubscriptionInterface = {
  _id: string;
  plan: "free" | "premium" | "ultimate";
  status: "active" | "cancelled" | "expired";
  admin: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
