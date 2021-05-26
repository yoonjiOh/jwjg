import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils";
import { AuthenticationError } from "apollo-server";
import { AWSS3Uploader } from '../s3';

const s3Uploader = new AWSS3Uploader({
  accessKeyId: 'AKIAVC6GVRQAPSA7O46J',
  secretAccessKey: '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',
  destinationBucketName: 'jwjg-issues',
});

async function createIssue(parent, args, context) {
  const { userId } = context;
  if (!userId) {
    throw new AuthenticationError('you must be logged in');
  }

  const new_issue = await context.prisma.issue.create({
    data: {
      title: args.title,
      content: args.content,
      img_url: args.img_url,
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
      img_url: args.img_url,
      option_list_json: args.option_list_json,
    },
  });

  return updated_issue;
}

async function createTagsByIssue(parent, args, context) {
  try {
    const result = await context.prisma.issuesHashTags.createMany({
      data: args.data,
      skipDuplicates: true,
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}

async function createStancesByIssue(parent, args, context) {
  try {
    const result = await context.prisma.stances.createMany({
      data: args.data,
      skipDuplicates: true,
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}

async function createUserStance(parent, args, context) {
  try {
    const result = await context.prisma.userStances.create({
      usersId: args.usersId,
      stancesId: args.stancesId,
      issuesId: args.issuesId,
      skipDuplicates: true,
    });
    return result;
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
      case 'P2002':
        throw new Error('User name already exists.');
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
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function createOpinion(parent, args, context) {
  const newOpinion = await context.prisma.opinions.create({
    data: {
      content: args.content,
      usersId: args.usersId,
      issuesId: args.issuesId,
      stancesId: args.stancesId,
    },
  });

  return newOpinion;
}

async function createOpinionComment(parent, args, context) {
  const newOpinionComment = await context.prisma.opinionComments.create({
    data: {
      content: args.content,
      usersId: args.usersId,
      opinionsId: args.opinionsId,
      stancesId: args.stancesId,
    },
  });

  return newOpinionComment;
}

async function doLikeActionToOpinion(parent, args, context) {
  const result = await context.prisma.opinionReacts.upsert({
    where: {
      usersId_opinionsId: { usersId: args.usersId, opinionsId: args.opinionsId },
    },
    update: {
      like: args.like,
    },
    create: {
      usersId: args.usersId,
      opinionsId: args.opinionsId,
      like: args.like,
    },
  });

  return result;
}

async function updateUserProfile(parent, args, context) {
  const result = await context.prisma.users.update({
    where: {
      id: args.id,
    },
    data: {
      name: args.name,
      intro: args.intro,
      profileImageUrl: args.profileImageUrl,
    },
  });
}

export default {
  createIssue,
  updateIssue,
  createTagsByIssue,
  createStancesByIssue,
  createUserStance,
  signup,
  login,
  singleUpload: s3Uploader.singleFileUploadResolver.bind(s3Uploader),
  createOpinion,
  createOpinionComment,
  doLikeActionToOpinion,
  updateUserProfile,
};
