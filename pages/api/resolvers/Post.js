/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function user(parent, _args, context) {
  return await context.prisma.user.findUnique({
    where: { id: parent.author_id },
  });
}

export default {
  user,
};
