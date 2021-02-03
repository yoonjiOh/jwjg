import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "apollo-server-micro";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import fs from "fs";
import path from "path";
import { getUserId } from "./utils";

const prisma = new PrismaClient();

const resolvers = {
  Query,
  Mutation,
  User,
};

const apolloServer = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(process.cwd(), "pages", "api", "schema.graphql"),
    "utf8"
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: "/api" });
