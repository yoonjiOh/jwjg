/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthenticationError } from 'apollo-server';

async function user(parent, args, context) {
  console.log('여기로 오는구나');
  return await context.prisma.users.findUnique({
    where: { id: args.id },
  });
}

async function userByFirebase(parent, args, context) {
  console.log('userByFireBase here', args);
  return await context.prisma.users.findUnique({
    where: { firebaseUID: args.firebaseUID },
  });
}

async function users(parent, args, context) {
  console.log('here~~');
  // console.log(context.prisma);
  return await context.prisma.users.findMany();
}

async function stances(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  return await context.prisma.stances.findMany({
    where,
  });
}

async function stancesByIssueId(parent, args, context) {
  const where = args.issuesId ? { issuesId: args.issuesId } : {};
  return await context.prisma.stances.findMany({
    where,
  });
}

async function issues(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  const issues = await context.prisma.issues.findMany({
    where,
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
  console.log('pupupu');
  const where = args.id ? { id: args.id } : {};
  const opinions = await context.prisma.opinions.findMany({
    where,
  });
  return opinions;
}

async function opinionsWithIssuesId(parent, args, context) {
  const opinions = await context.prisma.opinions.findMany({
    where: {
      issuesId: args.issuesId,
    },
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

async function opinionCommentReacts(parent, args, context) {
  return await context.prisma.opinionCommentReacts.findMany({
    where: { opinionCommentsId: args.id },
  });
}


export default {
  user,
  userByFirebase,
  users,
  issues,
  hashTags,
  opinions,
  stances,
  stancesByIssueId,
  opinionComments,
  issueHashTags,
  opinionsWithIssuesId,
  opinionCommentReacts,
};
