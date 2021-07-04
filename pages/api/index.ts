import { ApolloServer } from 'apollo-server-micro';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Opinion from './resolvers/Opinions';
import Issue from './resolvers/Issue';
import IssueHashTag from './resolvers/IssueHashTag';
import OpinionComment from './resolvers/OpinionComment';
import UserStance from './resolvers/UserStance';
import fs from 'fs';
import path from 'path';
import { getUserId } from './utils';
import prisma from '../../lib/db';
import cors from 'micro-cors';

const resolvers = {
  Query,
  Mutation,
  User,
  Opinion,
  OpinionComment,
  IssueHashTag,
  Issue,
  UserStance,
};

const apolloServer = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(process.cwd(), 'pages', 'api', 'schema.graphql'), 'utf8'),
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

const optionsHandler = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return;
  }
  return apolloServer.createHandler({ path: '/api' })(req, res);
};

export default cors()(optionsHandler);
