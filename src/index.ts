import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server";
import { join } from "path";

let books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const schema = loadSchemaSync(join(__dirname, "./../schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});

const resolvers = {
  Query: {
    books: () => books,
  },
};

const schemeWithResolvers = addResolversToSchema({ schema, resolvers });

const server = new ApolloServer({ schema: schemeWithResolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
