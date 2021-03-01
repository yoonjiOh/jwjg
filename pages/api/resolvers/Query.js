/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthenticationError } from "apollo-server";

function user(parent, args, context) {
  return context.prisma.user.findUnique({
    id: args.id,
  });
}

function users(parent, args, context) {
  return context.prisma.user.findMany();
}

function stances(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  return context.prisma.stances.findMany({
    where,
  });
}

async function issues(parent, args, context) {
  const where = args.id ? { id: args.id } : {};

  const issues = await context.prisma.issues.findMany({
    where,
    // include: { opinions: true, stances: true, issueHashTags: true },
  });

  return issues;
}

async function hashTags(parent, args, context) {
  const where = args.id ? { id: args.id } : {};

  const tags = await context.prisma.hashTags.findMany({
    where,
  });

  return tags;
}

async function issueHashTags(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  return await context.prisma.issueHashTags.findMany({
    where,
    include: { hashTags: true },
  });
}

async function opinions(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  const opinions = await context.prisma.opinion.findMany({
    where,
    include: { users: true, stances: true },
  });
  return opinions;
}

async function opinionComments(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  const opinionComments = await context.prisma.opinionComments.findMany({
    where,
  });

  return opinionComments;
}

export default {
  user,
  users,
  issues,
  hashTags,
  opinions,
  stances,
  opinionComments,
  issueHashTags,
};
