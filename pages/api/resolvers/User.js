/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
async function name(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { id: parent.id },
  });
  return user.name;
}

function responses(parent, args, context) {
  return context.prisma.response.findMany({
    where: {
      issue_id: args.issue_id,
      user_id: parent.id,
    },
  });
}

export default {
  name,
  responses,
};
