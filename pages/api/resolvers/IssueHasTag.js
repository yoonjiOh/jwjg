/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

function tag(parent, args, context) {
  const tag = context.prisma.tag.findUnique({
    where: { id: parent.tag_id },
  });
  return tag;
}

export default {
  tag,
};
