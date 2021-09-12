/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthenticationError } from 'apollo-server';

async function user(parent, args, context) {
  return await context.prisma.user.findUnique({
    where: { id: args.id },
  });
}

async function userInfo(parent, args, context) {
  const userId = args.userId;
  if (!userId) return null;
  return await context.prisma.userInfo.findUnique({
    where: { userId: userId },
  });
}

async function userByFirebase(parent, args, context) {
  const firebaseUID = args.firebaseUID;
  if (!firebaseUID) return null;
  return await context.prisma.user.findUnique({
    where: { firebaseUID: args.firebaseUID },
  });
}

async function userByFirebaseWithIssuesId(parent, args, context) {
  const firebaseUID = args.firebaseUID;
  if (!firebaseUID) return null;
  return await context.prisma.user.findUnique({
    where: { firebaseUID: args.firebaseUID },
  });
}

async function users(parent, args, context) {
  return await context.prisma.user.findMany();
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
  const where = args.id ? { id: args.id, isDeleted: false } : { isDeleted: false };
  const issues = await context.prisma.issues.findMany({
    where,
  });
  return issues;
}

async function publishedIssues(parent, args, context) {
  const where = args.id ? { id: args.id } : { isPublished: true };
  const issues = await context.prisma.issues.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return issues;
}

async function issue(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  const issue = await context.prisma.issues.findUnique({
    where,
  });
  return issue;
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

async function myStance(parent, args, context) {
  return await context.prisma.userStances.findFirst({
    where: {
      issuesId: args.issuesId,
      userId: args.usersId,
    },
  });
}

async function myOpinion(parent, args, context) {
  return await context.prisma.opinions.findFirst({
    where: {
      userId: args.usersId,
      issuesId: args.issuesId,
    },
  });
}

export default {
  user,
  userInfo,
  userByFirebase,
  users,
  issue,
  issues,
  publishedIssues,
  hashTags,
  opinions,
  stances,
  stancesByIssueId,
  opinionComments,
  issueHashTags,
  opinionsWithIssuesId,
  opinionCommentReacts,
  userByFirebaseWithIssuesId,
  myStance,
  myOpinion,
};
