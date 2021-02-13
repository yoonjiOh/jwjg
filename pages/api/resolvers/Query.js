function users(parent, args, context) {
  return context.prisma.user.findMany();
}

async function issues(parent, args, context) {
  const where = args.id ? { id: args.id } : {};

  const issues = await context.prisma.issue.findMany({
    where,
  });

  return issues;
}

async function tags(parent, args, context) {
  const where = args.id ? { id: args.id } : {};

  const tags = await context.prisma.tag.findMany({
    where,
  });

  return tags;
}

export default {
  users,
  issues,
  tags,
};
