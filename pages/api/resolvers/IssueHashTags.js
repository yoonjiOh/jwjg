/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function hashTags(parent, args, context) {
  const hashTag = context.prisma.hashTags.findUnique({
    where: { id: parent.tag_id },
  });
  return hashTag;
}

export default {
  hashTags,
};
