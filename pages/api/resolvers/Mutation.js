
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const APP_SECRET = 'jwjg-best-luck34';

// For type:user
async function signup(parent, args, context, info) {
	const password = await bcrypt.hash(args.password, 10)
	const user = await context.prisma.user.create({ data: { ...args, password } })
	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
	  token,
	  user,
	}
  }

module.exports = {
	createIssue,
	signup
}
