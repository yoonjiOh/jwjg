/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function user(parent, _args, context) {
  return await context.prisma.users.findUnique({
    where: { id: parent.usersId },
  });
}

async function opinionReacts(parent, _args, context) {
  return await context.prisma.opinionReacts.findMany({
    where: { opinionsId: parent.id }
  })
}

async function stance(parent, _args, context) {
  return await context.prisma.stances.findUnique({
    where: { id: parent.stancesId }
  })
}

async function opinionComments(parent, _args, context) {
  console.log('opinionComments');
  return await context.prisma.opinionComments.findMany({
    where: { opinionsId: parent.id }
  })
}

export default {
  user,
  opinionReacts,
  opinionComments,
  stance
};
