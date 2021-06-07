
async function user(parent, _args, context) {
  const user = await context.prisma.users.findUnique({
    where: { id: parent.usersId },
  });
  return user;
}

async function stance(parent, _args, context) {
  return await context.prisma.stances.findUnique({
    where: { id: parent.stancesId },
  });
}

async function opinionCommentReactsSum(parent, _args, context) {
  const result = await context.prisma.opinionCommentReacts.findMany({
    where: { opinionCommentsId: parent.id, like: true },
  });
  return result?.length;
}

export default {
  user,
  stance,
  opinionCommentReactsSum,
};
