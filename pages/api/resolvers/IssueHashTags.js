/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { hash } from "bcryptjs";

async function hashTags(parent, args, context) {
  const hashTag = await context.prisma.hashTags.findMany({
    where: { id: parent.hashTagsId },
  });
  return hashTag;
}

export default {
  hashTags,
};
