import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { join } from "path";
import type { Customer, Item, Order } from "./types";

let customers: Customer[] = [
  { id: 1, name: "customer A", email: "a@dummy.com" },
  { id: 2, name: "customer B", email: "b@dummy.com" },
  { id: 3, name: "customer C", email: "c@dummy.com" },
];

let items: Item[] = [
  { id: 1, name: "item A", price: 1000 },
  { id: 2, name: "item B", price: 2000 },
  { id: 3, name: "item C", price: 3000 },
];

let orders: Order[] = [
  {
    id: 1,
    customer: customers[0]!,
    items: [items[0]!],
    totalPrice: 1000,
  },
  {
    id: 2,
    customer: customers[1]!,
    items: [items[1]!],
    totalPrice: 2000,
  },
  {
    id: 3,
    customer: customers[2]!,
    items: [items[2]!],
    totalPrice: 3000,
  },
  {
    id: 4,
    customer: customers[0]!,
    items: [items[0]!, items[1]!],
    totalPrice: 2000,
  },
  {
    id: 5,
    customer: customers[1]!,
    items: [items[0]!, items[1]!, items[2]!],
    totalPrice: 6000,
  },
];

const schema = loadSchemaSync(join(__dirname, "./../schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const resolvers = {
  Query: {
    getCustomers: () => customers,

    getOrders: () => orders,

    getCustomer: (_: unknown, arg: { id: number }) =>
      customers.find(({ id }) => id === arg.id),

    getOrder: (_: unknown, arg: { id: number }) =>
      orders.find(({ id }) => id === arg.id),

    getOrdersByCustomerId: (_: unknown, arg: { customerId: number }) =>
      orders.filter(({ customer }) => customer.id === arg.customerId),
  },
  Mutation: {
    addCustomer: (_: unknown, arg: { name: string; email: string }) => {
      const id =
        customers.reduce((id, customer) => Math.max(id, customer.id), 0) + 1;
      const { name, email } = arg;
      const customer: Customer = { id, name, email };
      customers.push(customer);
      return customer;
    },
  },
};

const schemeWithResolvers = addResolversToSchema({ schema, resolvers });

const server = new ApolloServer({ schema: schemeWithResolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
