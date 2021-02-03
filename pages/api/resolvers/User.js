function name(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).name();
}

export default {
  name,
};
