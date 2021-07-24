import { gql, useQuery, useMutation } from '@apollo/client';

import s from './Utils.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import _ from 'lodash';

import { DO_LIKE_ACTION_TO_OPINION_COMMENT } from '../lib/queries';

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
  const [doLikeActionToOpinionComment] = useMutation(DO_LIKE_ACTION_TO_OPINION_COMMENT);

  const router = useRouter();
  const likeCount =
    data &&
    data.opinionCommentReacts.length &&
    data.opinionCommentReacts.filter(react => !!react.like).length;
  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  const myReact =
    data && data.opinionCommentReacts.filter(react => react.usersId === Number(me && me.id));
  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  const handleClickLike = async (opinionCommentsId, isLikedByMe) => {
    try {
      await doLikeActionToOpinionComment({
        variables: {
          usersId: Number(me.id),
          opinionCommentsId: Number(opinionCommentsId),
          like: isLikedByMe ? false : true,
        },
      }).then(() => {
        router.reload();
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={s.commentBox} key={comment.id}>
      <div className={s[`stanceMark-${comment.stance.orderNum}`]} />
      <div className={s.commentWrapper}>
        <div className={s.profileWrapper}>
          <img className={s.profilePlaceholder} src={comment.user.profileImageUrl} />
          <div className={s.profileName}>{comment.user.name}</div>
          <div className={s.ago}>{dayjs(comment.createdAt).fromNow()}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruitsForStanceTitle[comment.stance.orderNum] + ' ' + comment.stance.title}
          </span>
          <span style={{ marginLeft: '5px' }}>{comment.content}</span>
        </div>
        <div className={s.likeWrapper} onClick={() => handleClickLike(comment.id, isLikedByMe)}>
          {isLikedByMe ? (
            <label style={{ color: '#4494FF' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                alt="좋아요 버튼"
              />
            </label>
          ) : (
            <label>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="좋아요 버튼"
              />
            </label>
          )}
          <span style={{ marginLeft: '5px' }}>{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
