import { gql, useQuery } from '@apollo/client';

import s from './Utils.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import _ from 'lodash';

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

const DO_LIKE_ACTION_TO_OPINION_COMMENT = gql`
  mutation doLikeActionToOpinionComment($usersId: Int!, $opinionCommentsId: Int!, $like: Boolean!) {
    doLikeActionToOpinionComment(
      usersId: $usersId
      opinionCommentsId: $opinionCommentsId
      like: $like
    ) {
      usersId
      opinionCommentsId
      like
    }
  }
`;

const OpinionBox = ({ opinion, userId }) => {
  const { data } = useQuery(GET_OPINION_COMMENT_REACTS, { variables: { id: opinion.id } });
  const router = useRouter();
  const likeCount =
    data &&
    data.opinionCommentReacts.length &&
    data.opinionCommentReacts.filter(react => !!react.like).length;
  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  return (
    <div
      className={s.commentBox}
      key={opinion.id}
      onClick={() => {
        if (userId) {
          router.push({
            pathname: '/opinions/[id]',
            query: { id: opinion.id, userId: userId },
          });
        }
      }}
    >
      <div className={s[`stanceMark-${opinion.stance.orderNum}`]} />
      <div className={s.commentWrapper}>
        <div className={s.profileWrapper}>
          <div className={s.profilePlaceholder}>
            <img src={opinion.user.profileImageUrl} />
          </div>
          <div className={s.profileName}>{opinion.user.name}</div>
          <div className={s.ago}>{dayjs(opinion.createdAt).fromNow()}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruitsForStanceTitle[opinion.stance.orderNum] + ' ' + opinion.stance.title}
          </span>
          <span style={{ marginLeft: '5px' }}>{opinion.content}</span>
        </div>
        <div className={s.likeWrapper}>
          <span style={{ marginRight: '10px' }}></span>
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

export default OpinionBox;
