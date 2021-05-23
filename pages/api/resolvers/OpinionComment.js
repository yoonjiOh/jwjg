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

export default {
  user,
  stance,
};