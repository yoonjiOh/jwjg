import { gql, useQuery, useMutation } from '@apollo/client';

import s from './Utils.module.scss';
import _ from 'lodash';

import { DO_LIKE_ACTION_TO_OPINION_COMMENT } from '../lib/graph_queries';
import { getPubDate } from '../lib/util';
import { fruits } from '../utils/getFruitForStanceTitle';

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
  const { data, refetch } = useQuery(GET_OPINION_COMMENT_REACTS, { variables: { id: comment.id } });
  const [doLikeActionToOpinionComment] = useMutation(DO_LIKE_ACTION_TO_OPINION_COMMENT);

  const likeCount =
    data &&
    data.opinionCommentReacts.length &&
    data.opinionCommentReacts.filter(react => !!react.like).length;

  const myReact =
    data && data.opinionCommentReacts.filter(react => react.userId === Number(me && me.id));
  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  const handleClickLike = async (opinionCommentsId, isLikedByMe) => {
    try {
      await doLikeActionToOpinionComment({
        variables: {
          userId: Number(me.id),
          opinionCommentsId: Number(opinionCommentsId),
          like: isLikedByMe ? false : true,
        },
      }).then(() => {
        refetch({ id: comment.id });
      });
    } catch (e) {
      console.error('[ERROR: LIKE COMMENT FAILED]', e);
      alert('좋아요 기능에 문제가 생겼습니다. 조금 있다 다시 시도해 주세요');
    }
  };

  return (
    <div className={s.commentBox} key={comment.id}>
      <div className={s[`stanceMark-${comment.stance.orderNum}`]} />
      <div className={s.commentWrapper}>
        <div className={s.profileWrapper}>
          <img className={s.profilePlaceholder} src={comment.user.image} />
          <div className={s.profileName}>{comment.user.name}</div>
          <div className={s.ago}>{getPubDate(comment.createdAt)}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruits[comment.stance.orderNum] + ' ' + comment.stance.title}
          </span>
          <span style={{ marginLeft: '5px' }}>{comment.content}</span>
        </div>
        <div className={s.likeWrapper} onClick={() => handleClickLike(comment.id, isLikedByMe)}>
          {isLikedByMe ? (
            <img
              style={{ color: '#4494FF' }}
              src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
              alt="좋아요 버튼"
            />
          ) : (
            <img
              src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
              alt="좋아요 버튼"
            />
          )}
          <span
            style={isLikedByMe ? { marginLeft: '5px', color: '#4494FF' } : { marginLeft: '5px' }}
          >
            {likeCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
