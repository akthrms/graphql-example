import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { join } from "path";
import type { Order } from "./types";

let orders: Order[] = [
  {
    id: 1,
    customer: { id: 1, name: "customer A", email: "a@dummy.com" },
    items: [{ id: 1, name: "item A", price: 1000 }],
    totalPrice: 1000,
  },
  {
    id: 2,
    customer: { id: 2, name: "customer B", email: "b@dummy.com" },
    items: [{ id: 2, name: "item B", price: 2000 }],
    totalPrice: 2000,
  },
  {
    id: 3,
    customer: { id: 3, name: "customer C", email: "c@dummy.com" },
    items: [{ id: 3, name: "item C", price: 3000 }],
    totalPrice: 3000,
  },
  {
    id: 4,
    customer: { id: 1, name: "customer A", email: "a@dummy.com" },
    items: [
      { id: 1, name: "item A", price: 1000 },
      { id: 2, name: "item B", price: 2000 },
    ],
    totalPrice: 2000,
  },
  {
    id: 5,
    customer: { id: 2, name: "customer B", email: "b@dummy.com" },
    items: [
      { id: 1, name: "item A", price: 1000 },
      { id: 2, name: "item B", price: 2000 },
      { id: 3, name: "item C", price: 3000 },
    ],
    totalPrice: 6000,
  },
];

const schema = loadSchemaSync(join(__dirname, "./../schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const resolvers = {
  Query: {
    getOrders: () => orders,
    getOrderById: (_: unknown, arg: { id: number }) =>
      orders.find(({ id }) => id === arg.id),
  },
};

const schemeWithResolvers = addResolversToSchema({ schema, resolvers });

const server = new ApolloServer({ schema: schemeWithResolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
