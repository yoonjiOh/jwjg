function users(parent, args, context) {
	return context.prisma.user.findMany();
}

module.exports = {
	users
}

