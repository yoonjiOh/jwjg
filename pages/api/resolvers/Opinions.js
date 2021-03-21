/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function user(parent, _args, context) {
  return await context.prisma.users.findUnique({
    where: { id: parent.usersId },
  });
}

export default {
  user,
};
