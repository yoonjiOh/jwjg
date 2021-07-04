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

// export default cors((req, res) => {
//   return apolloServer.createHandler({
//     path: '/api',
//   })(req, res);
// });

// const server_handlers = apolloServer.start().then(() => {
//   console.log('starting server.');
//   const handler = apolloServer.createHandler({ path: '/api' }); // highlight-line
//   return Cors((req, res) => handler(req, res)); // highlight-line
// });

export const config = {
  api: {
    bodyParser: false,
  },
};

// const server_handlers = apolloServer.createHandler({ path: '/api' });

// console.log(server_handlers);
// export default server_handlers;

// export default apolloServer.start().then(() => {
//   const handler = apolloServer.createHandler({ path: '/api' }); // highlight-line
//   return Cors((req, res) => handler(req, res)); // highlight-line
// });

// export default apolloServer;

export default cors()(apolloServer.createHandler({ path: '/api' }));
// export default apolloServer.createHandler({ path: '/api' });
// module.exports = apolloServer.start().then(() => apolloServer.createHandler({ path: '/api' }));
