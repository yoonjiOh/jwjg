import { gql, useQuery } from '@apollo/client';

import s from './Utils.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

const GET_OPINION_COMMENT_REACTS = gql`
  query opinionComment($id: Int!) {
    opinionCommentReacts(id: $id) {
      like
      usersId
      opinionCommentsId
    }
  }
`;

const CommentBox = ({ comment, me }) => {
  const { data } = useQuery(GET_OPINION_COMMENT_REACTS, { variables: { id: comment.id } });
  const router = useRouter();
  const likeCount =
    data &&
    data.opinionCommentReacts.length &&
    data.opinionCommentReacts.filter(react => !!react.like).length;
  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  return (
    <div
      className={s.commentBox}
      key={comment.id}
      onClick={() => {
        if (me) {
          router.push({
            pathname: '/opinions/[id]',
            query: { id: comment.id, userId: me.id },
          });
        }
      }}
    >
      <div className={s[`stanceMark-${comment.stance.orderNum}`]} />
      <div className={s.commentWrapper}>
        <div className={s.profileWrapper}>
          <div className={s.profilePlaceholder} />
          <div className={s.profileName}>{comment.user.name}</div>
          <div className={s.ago}>{dayjs(comment.createdAt).fromNow()}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruitsForStanceTitle[comment.stance.orderNum] + ' ' + comment.stance.title}
          </span>
          <span style={{ marginLeft: '5px' }}>{comment.content}</span>
        </div>
        <div className={s.likeWrapper}>
          <span style={{ marginRight: '10px' }}>좋아요</span>
          <img
            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
            alt="좋아요 버튼"
          />
          <span style={{ marginLeft: '5px' }}>{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
