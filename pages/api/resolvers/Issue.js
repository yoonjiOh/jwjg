/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const opinions = async (parent, _args, context) => {
  return await context.prisma.opinions.findMany({
    where: { issuesId: parent.id },
  });
};

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

const issueHashTags = async (parent, _args, context) => {
  return await context.prisma.issueHashTags.findMany({
    where: { issuesId: parent.id },
  });
};

const userStances = async (parent, _args, context) => {
  return await context.prisma.userStances.findMany({
    where: { issuesId: parent.id },
  });
};

export default {
  opinions,
  stances,
  issueHashTags,
  userStances,
};
