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

export default {
  users,
  issues,
};
