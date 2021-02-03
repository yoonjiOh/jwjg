import { hash } from "bcryptjs";
import { sign } from "jsonwebtoken";

async function createIssue(parent, args, context) {
  const new_issue = await context.prisma.issue.create({
    data: {
      id: args.id,
      title: args.title,
      content: args.content,
      option_list_json: args.option_list_json,
    },
  });

  return new_issue;
}

async function updateIssue(parent, args, context) {
  const updated_issue = await context.prisma.issue.update({
    where: { id: args.id },
    data: {
      title: args.title,
      content: args.content,
      option_list_json: args.option_list_json,
    },
  });

  return updated_issue;
}

const APP_SECRET = "jwjg-best-luck34";

// For type:user
// TODO(jurampark): accepts firebase id token to support social auth like google/apple login.
async function signup(parent, args, context, info) {
  const password = await hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });
  const token = sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}
export default {
  createIssue,
  updateIssue,
  signup,
};
