/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function name(parent, args, context) {
  const user = await context.prisma.users.findUnique({
    where: { id: parent.id },
  });
  return user.name;
}

function stances(parent, args, context) {
  return context.prisma.response.findMany({
    where: {
      issuesId: args.issue_id,
      usersId: parent.id,
    },
  });
}

export default {
  name,
  stances,
};
