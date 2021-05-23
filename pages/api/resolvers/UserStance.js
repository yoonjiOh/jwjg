const stances = async (parent, _args, context) => {
  return await context.prisma.stances.findMany({
    where: { id: parent.stancesId },
  });
};

export default {
  stances,
};
