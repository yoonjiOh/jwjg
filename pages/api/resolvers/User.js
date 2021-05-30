/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function name(parent, args, context) {
  const user = await context.prisma.users.findUnique({
    where: { id: parent.id },
  });
  return user.name;
}

async function user(parent, args, context) {
  return await context.prisma.users.findUnique({
    where: {
      id: parent.id,
    },
  });
}

async function userStance(parent, args, context) {
  return await context.prisma.userStances.findFirst({
    where: {
      issuesId: args.issuesId,
      usersId: parent.id,
    },
  });
}

async function userStances(parent, _args, context) {
  return await context.prisma.userStances.findMany({
    where: {
      usersId: parent.id,
    },
  });
}

async function opinions(parent, _args, context) {
  return await context.prisma.opinions.findMany({
    where: {
      usersId: parent.id,
    },
  });
}

async function opinionComments(parent, _args, context) {
  return await context.prisma.opinionComments.findMany({
    where: {
      usersId: parent.id,
    },
  });
}

export default {
  name,
  user,
  userStance,
  userStances,
  opinions,
  opinionComments,
};
