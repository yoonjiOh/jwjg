async function createIssue(parent, args, context) {
	const newIssue = await context.prisma.issue.create({
		data: {
			title: args.title,
			content: args.content,
			tag_id: args.tag_id
		}
	})

	return newIssue;
}

module.exports = {
	createIssue
}
