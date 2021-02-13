/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function user(parent, args, context) {
  return context.prisma.user.findUnique({
    id: args.id,
  });
}

function users(parent, args, context) {
  return context.prisma.user.findMany();
}

function response(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  return context.prisma.response.findMany({
    where,
  });
}

async function issues(parent, args, context) {
  const where = args.id ? { id: args.id } : {};

  const issues = await context.prisma.issue.findMany({
    where,
    include: { post: true, response: true, issue_has_tag: true },
  });

  return issues;
}

async function issueHasTags(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  return await context.prisma.issue_has_tag.findMany({
    where,
    include: { tag: true },
  });
}

async function posts(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  const posts = await context.prisma.post.findMany({
    where,
    include: { user: true, response: true },
  });
  return posts;
}

async function comments(parent, args, context) {
  const where = args.id ? { id: args.id } : {};
  const comments = await context.prisma.comment.findMany({
    where,
  });

  return comments;
}

export default {
  user,
  users,
  issues,
  posts,
  response,
  comments,
  issueHasTags,
};
