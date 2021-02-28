import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils";
import { AuthenticationError } from "apollo-server";

async function createIssue(parent, args, context) {
  const { userId } = context;
  if (!userId) {
    throw new AuthenticationError("you must be logged in");
  }

  const new_issue = await context.prisma.issue.create({
    data: {
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

async function createTagsByIssue(parent, args, context) {
  try {
    const result = await context.prisma.issue_has_tag.createMany({
      data: args.data,
      skipDuplicates: true
    });

    return result
  } catch (e) {
    console.error(e);
  }
}

// For type:user
// TODO(jurampark): accepts firebase id token to support social auth like google/apple login.
async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  var user;
  try {
    user = await context.prisma.user.create({
      data: { ...args, password },
    });
  } catch (e) {
    // https://www.prisma.io/docs/concepts/components/prisma-client/error-reference
    switch (e.code) {
      case "P2002":
        throw new Error("User name already exists.");
    }
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

// TODO(jurampark): accepts firebase id token to support social auth like google/apple login.
async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

export default {
  createIssue,
  updateIssue,
  createTagsByIssue,
  signup,
  login,
};
