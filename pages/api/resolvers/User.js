async function userStance(parent, args, context) {
  return await context.prisma.userStances.findFirst({
    where: {
      issuesId: args.issuesId,
      userId: parent.id,
    },
  });
}

async function userStances(parent, _args, context) {
  return await context.prisma.userStances.findMany({
    where: {
      userId: parent.id,
    },
  });
}

async function opinions(parent, _args, context) {
  return await context.prisma.opinions.findMany({
    where: {
      userId: parent.id,
    },
  });
}

async function opinionComments(parent, _args, context) {
  return await context.prisma.opinionComments.findMany({
    where: {
      userId: parent.id,
    },
  });
}

async function userInfo(parent, _args, context) {
  const result = await context.prisma.userInfo.findUnique({
    where: { userId: parseInt(parent.id) },
  });

  return result;
}

async function myOpinion(parent, args, context) {
  return await context.prisma.opinions.findFirst({
    where: { issuesId: args.issuesId, userId: parent.id },
  });
}

export default { userStances, opinions, userStance, opinionComments, userInfo, myOpinion };
