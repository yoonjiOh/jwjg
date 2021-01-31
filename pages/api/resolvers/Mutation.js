async function createIssue(parent, args, context) {
	const new_issue = await context.prisma.issue.create({
		data: {
			id: args.id,
			title: args.title,
			content: args.content,
			option_list_json: args.option_list_json,
		}
	});

	return new_issue;
}

async function updateIssue(parent, args, context) {
	const updated_issue = await context.prisma.issue.update({
		where: { id: args.id },
		data: { title: args.title, content: args.content, option_list_json: args.option_list_json }
	});

	return updated_issue;
}

module.exports = {
	createIssue,
	updateIssue
};
