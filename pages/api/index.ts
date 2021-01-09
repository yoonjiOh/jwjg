import { makeSchema, objectType, stringArg } from '@nexus/schema'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import path from 'path'

const prisma = new PrismaClient()

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('name')
    t.list.field('posts', {
      type: 'Post',
        resolve: parent =>
          prisma.user
            .findOne({
              where: { id: Number(parent.id) },
            })
            .post(),
    })
  }
});

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.int('owner_id')
    t.string('title')
  }
});

const Issue = objectType({
  name: 'Issue',
  definition(t) {
    t.int('id')
    t.string('issue_title')
    t.string('content')
  }
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('post', {
      type: 'Post',
      resolve: (_, args) => {
        return prisma.post.findOne({
          where: { id: Number(args.postId) },
        })
      }
    })
  }
})


export const schema = makeSchema({
  types: [Query, Post, User, Issue],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql')
  },
})

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
})

