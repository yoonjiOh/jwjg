import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from '../utils';
import { AWSS3Uploader } from '../s3';

const s3Uploader = new AWSS3Uploader({
  accessKeyId: 'AKIAVC6GVRQAPSA7O46J',
  secretAccessKey: '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',
  destinationBucketName: 'jwjg-issues',
});

async function createIssue(parent, args, context) {
  const new_issue = await context.prisma.issues.create({
    data: {
      title: args.title,
      content: args.content,
      imageUrl: args.imageUrl,
      authorId: args.authorId,
    },
  });

  return new_issue;
}

async function updateIssue(parent, args, context) {
  const updated_issue = await context.prisma.issues.update({
    where: { id: args.id },
    data: {
      title: args.title,
      content: args.content,
      imageUrl: args.imageUrl,
    },
  });

  return updated_issue;
}

async function createTagsByIssue(parent, args, context) {
  try {
    const result = await context.prisma.issueHashTags.createMany({
      data: args.data,
      skipDuplicates: true,
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}

async function createTag(parent, args, context) {
  try {
    const result = await context.prisma.hashTags.create({
      data: {
        name: args.name,
      },
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

async function upsertStance(parent, args, context) {
  try {
    const result = await context.prisma.stances.upsert({
      where: {
        id_issuesId: { id: args.id, issuesId: args.issuesId },
      },
      update: {
        title: args.title,
      },
      create: {
        issuesId: args.issuesId,
        title: args.title,
        orderNum: args.orderNum,
      },
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}

async function createUserStance(parent, args, context) {
  try {
    const result = await context.prisma.userStances.upsert({
      where: {
        userId_issuesId: { userId: args.userId, issuesId: args.issuesId },
      },
      update: {
        stancesId: args.stancesId,
      },
      create: {
        userId: args.userId,
        stancesId: args.stancesId,
        issuesId: args.issuesId,
      },
    });

    return result;
  } catch (e) {
    console.error(e);
  }
}

async function deleteUserStance(parent, args, context) {
  try {
    const result = await context.prisma.userStances.delete({
      where: {
        usersId_issuesId: {
          userId: args.userId,
          issuesId: args.issuesId,
        },
      },
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
      userId: args.userId,
      issuesId: args.issuesId,
      stancesId: args.stancesId,
    },
  });

  return newOpinion;
}

async function updateOpinion(parent, args, context) {
  const payload = {};
  if (args.stancesId) payload.stancesId = args.stancesId;
  if (args.content) payload.content = args.content;

  const updatedOpinion = await context.prisma.opinions.update({
    where: { id: args.id },
    data: payload,
  });

  return updatedOpinion;
}

async function createOpinionComment(parent, args, context) {
  const newOpinionComment = await context.prisma.opinionComments.create({
    data: {
      content: args.content,
      userId: args.userId,
      opinionsId: args.opinionsId,
      stancesId: args.stancesId,
    },
  });

  return newOpinionComment;
}

async function doLikeActionToOpinion(parent, args, context) {
  const result = await context.prisma.opinionReacts.upsert({
    where: {
      usersId_opinionsId: { userId: args.userId, opinionsId: args.opinionsId },
    },
    update: {
      like: args.like,
    },
    create: {
      userId: args.userId,
      opinionsId: args.opinionsId,
      like: args.like,
    },
  });

  return result;
}

async function doLikeActionToOpinionComment(parent, args, context) {
  const result = await context.prisma.opinionCommentReacts.upsert({
    where: {
      usersId_opinionCommentsId: {
        userId: args.userId,
        opinionCommentsId: args.opinionCommentsId,
      },
    },
    update: {
      like: args.like,
    },
    create: {
      userId: args.userId,
      opinionCommentsId: args.opinionCommentsId,
      like: args.like,
    },
  });

  return result;
}

async function updateUserInfo(_, { id, name, nickname, intro, image, consentToSAt }, { prisma }) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      nickname: nickname,
      intro: intro,
      image: image,
      consentToSAt: consentToSAt,
    },
  });
}

async function createUserInfo(parent, args, context) {
  return await context.prisma.userInfo.create({
    data: {
      userId: args.userId,
      gender: args.gender,
      age: args.age,
      residence: args.residence,
    },
  });
}

async function manageIssuePublishStatus(parent, args, context) {
  await context.prisma.issues.update({
    where: {
      id: args.id,
    },
    data: {
      isPublished: args.isPublished,
    },
  });
}

async function deleteIssue(parent, args, context) {
  await context.prisma.issues.update({
    where: {
      id: args.id,
    },
    data: {
      isDeleted: true,
    },
  });
}

async function manageApproveHotIssue(parent, args, context) {
  await context.prisma.issues.update({
    where: {
      id: args.id,
    },
    data: {
      isHotIssue: args.isHotIssue,
    },
  });
}

async function manageRollbackHotIssue(parent, args, context) {
  await context.prisma.issues.update({
    where: {
      id: args.id,
    },
    data: {
      isHotIssue: args.isHotIssue,
    },
  });
}

export default {
  createIssue,
  updateIssue,
  createTagsByIssue,
  createTag,
  createStancesByIssue,
  upsertStance,
  createUserStance,
  deleteUserStance,
  signup,
  login,
  singleUpload: s3Uploader.singleFileUploadResolver.bind(s3Uploader),
  createOpinion,
  updateOpinion,
  createOpinionComment,
  doLikeActionToOpinion,
  doLikeActionToOpinionComment,
  updateUserInfo,
  createUserInfo,
  manageIssuePublishStatus,
  deleteIssue,
  manageApproveHotIssue,
  manageRollbackHotIssue,
};
