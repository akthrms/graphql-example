export type Customer = {
  id: number;
  name: string;
  email: string;
};

export type Item = {
  id: number;
  name: string;
  price: number;
};

export type Order = {
  id: number;
  customer: Customer;
  items: Item[];
  totalPrice: number;
};
