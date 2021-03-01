/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const opinions = async (parent, _args, context) => {
  return await context.prisma.opinions.findMany({
    where: { id: parent.issuesId },
  });
};

const stances = async (parent, _args, context) => {
  return await context.prisma.stances.findMany({
    where: { id: parent.issuesId },
  });
};

export default {
  opinions,
  stances,
};
