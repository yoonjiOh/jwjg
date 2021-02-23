async function name(parent, args, context) {
  const user = await context.prisma.user.findUnique({
    where: { id: parent.id },
  });
  return user.name;
}

export default {
  name,
};
