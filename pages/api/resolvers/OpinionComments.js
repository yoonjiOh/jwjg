async function user(parent, args, context) {
  const user = await context.prisma.users.findUnique({
    where: { id: parent.usersId },
  });
  console.log(user);
  return user;
}

async function opinionCommentReacts(parent, args, context) {
  await context.prisma.opinionCommentReacts.findMany({
    where: { opinionCommentsId: parent.id },
  });
}

export default { user, opinionCommentReacts };