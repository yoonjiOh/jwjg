import { useMutation, useQuery } from '@apollo/client';

import s from './Utils.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import { withAuthUser, useAuthUser } from 'next-firebase-auth';

import {
  GET_USERS,
  GET_OPINION_REACTS_AND_COMMENTS,
  DO_LIKE_ACTION_TO_OPINION,
} from '../lib/queries';

import _ from 'lodash';

dayjs.extend(relativeTime);

const OpinionBox = ({ opinion, userStance }) => {
  const { data } = useQuery(GET_OPINION_REACTS_AND_COMMENTS, { variables: { id: opinion.id } });
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);

  const router = useRouter();

  const likeCount = data && data.opinions && data.opinions[0].opinionReactsSum;
  const commentCount = data && data.opinions && data.opinions[0].opinionCommentsSum;

  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  const AuthUser = useAuthUser();
  const { data: userData } = useQuery(GET_USERS, {
    variables: { firebaseUID: AuthUser.id },
  });

  const userId = userData?.userByFirebase?.id;

  const myReact =
    opinion &&
    opinion.opinionReacts.length &&
    opinion.opinionReacts.filter(react => react.usersId === Number(userId));

  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  const handleClickLike = async () => {
    try {
      await doLikeActionToOpinion({
        variables: {
          usersId: Number(userId),
          opinionsId: Number(opinion.id),
          like: isLikedByMe ? false : true,
        },
      }).then(() => router.reload());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      className={s.commentBox}
      key={opinion.id}
      onClick={() => {
        if (userId) {
          router.push({
            pathname: '/opinions/[id]',
            query: { id: opinion.id },
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
            {fruitsForStanceTitle[userStance?.stances[0].orderNum] +
              ' ' +
              userStance?.stances[0].title}
          </span>
          <span style={{ marginLeft: '5px' }}>{opinion.content}</span>
        </div>
        <div className={s.likeWrapper}>
          <span style={{ marginRight: '10px' }}></span>

          {isLikedByMe ? (
            <label style={{ color: '#4494FF', cursor: 'pointer' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                alt="좋아요 버튼"
                onClick={() => handleClickLike()}
                style={{ marginTop: '2px', marginRight: '3px' }}
              />{' '}
              <span style={{ marginRight: '7px', color: '#4494FF' }}>{likeCount}</span>
            </label>
          ) : (
            <label style={{ cursor: 'pointer' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="좋아요 버튼"
                style={{ marginTop: '2px', marginRight: '3px' }}
                onClick={() => handleClickLike()}
              />{' '}
              <span style={{ marginRight: '7px' }}>{likeCount}</span>
            </label>
          )}

          <img src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg" alt="코멘트" />
          <span style={{ marginLeft: '6px' }}>{commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default withAuthUser()(OpinionBox);
