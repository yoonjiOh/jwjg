/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function user(parent, _args, context) {
  return await context.prisma.users.findUnique({
    where: { id: parent.usersId },
  });
}

async function opinionReacts(parent, _args, context) {
  return await context.prisma.opinionReacts.findMany({
    where: { opinionsId: parent.id, like: true },
  });
}

async function opinionReactsSum(parent, _args, context) {
  const result = await context.prisma.opinionReacts.findMany({
    where: { opinionsId: parent.id, like: true },
  });
  return result?.length;
}

async function opinionCommentsSum(parent, _args, context) {
  const result = await context.prisma.opinionComments.findMany({
    where: { opinionsId: parent.id },
  });
  return result?.length;
}

async function stance(parent, _args, context) {
  return await context.prisma.stances.findUnique({
    where: { id: parent.stancesId },
  });
}

const stances = async (parent, _args, context) => {
  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];
  const result = await context.prisma.stances.findMany({
    where: { issuesId: parent.id },
  });
  const stances = result.map((stance, index) => {
    return {
      ...stance,
      fruit: fruitsForStanceTitle[index],
    };
  });
  return stances;
};

async function opinionComments(parent, _args, context) {
  return await context.prisma.opinionComments.findMany({
    where: { opinionsId: parent.id },
  });
}

export default {
  user,
  opinionReacts,
  opinionReactsSum,
  opinionCommentsSum,
  opinionComments,
  stance,
  stances,
};
