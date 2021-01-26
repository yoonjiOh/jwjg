function users(parent, args, context) {
	return context.prisma.user.findMany();
}

function issue_list(parent, args, context) {
	return context.prisma.issue.findMany();
}

function issue(parent, args, context) {
	return context.prisma.issue.findUnique({
		where: {
			id: args.id
		}
	});
}

module.exports = {
	users,
	issue,
	issue_list
};

