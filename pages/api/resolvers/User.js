/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function name(parent, args, context) {
  const user = await context.prisma.users.findUnique({
    where: { id: parent.id },
  });
  return user.name;
}

async function userStance(parent, args, context) {
  return await context.prisma.userStances.findFirst({
    where: {
      issuesId: args.issuesId,
      usersId: parent.id,
    },
  });
}

export default {
  name,
  userStance,
};
