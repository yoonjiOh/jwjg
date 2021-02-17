/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// FIXME: issues query 불러올 때 user가 포함되어 있을 때 아래 name 함수가 실행되면서 문제가 생김. 어떻게 해결해야 할까?
// parent 안에 이미 user 객체값이 들어있어서 그런 것 같다.
function name(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).name();
}

function responses(parent, args, context) {
  return context.prisma.response.findMany({
    where: {
      issue_id: args.issue_id,
      user_id: parent.id,
    },
  });
}

export default {
  name,
  responses,
};
