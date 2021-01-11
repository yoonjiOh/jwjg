import { makeSchema, objectType, stringArg, intArg, asNexusMethod } from 'nexus'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { GraphQLDate } from 'graphql-iso-date'
import path from 'path'

export const GQLDate = asNexusMethod(GraphQLDate, 'date')

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

const Tag = objectType({
  name: 'Tag',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('type')
  }
});

const Issue = objectType({
  name: 'Issue',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('content')
    t.int('tag_id')
  }
});

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      resolve: (_parent, args) => {
        return prisma.user.findMany({
          where: { role: 1 },
        })
      }
    })
  }
});

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createIssue', {
      type: 'Issue',
      args: {
        title: stringArg(),
        content: stringArg(),
        c_time: "Date",
        tag_id: intArg(),
      },
      resolve: (_, { title, content, c_time, tag_id }, ctx) => {
        return prisma.issue.create({
          data: {
            title,
            content,
            c_time,
            tag_id
          }
        })
      }
    })
  }
})


export const schema = makeSchema({
  types: [Query, Mutation, Post, User, Issue, GQLDate],
  outputs: {
    typegen: path.join(process.cwd(), 'pages', 'api', 'nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'pages', 'api', 'schema.graphql')
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default new ApolloServer({ schema }).createHandler({
  path: '/api',
})

