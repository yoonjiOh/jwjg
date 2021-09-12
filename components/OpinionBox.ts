import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import s from './Utils.module.scss';
import { useRouter } from 'next/router';
import { withAuthUser, useAuthUser } from 'next-firebase-auth';
import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../libs/requireAuthentication';

import {
  GET_USERS,
  GET_OPINION_REACTS_AND_COMMENTS,
  DO_LIKE_ACTION_TO_OPINION,
} from '../lib/queries';

import _ from 'lodash';
import { fruits } from '../utils/getFruitForStanceTitle';
import { getPubDate } from '../lib/util';
import { User } from 'next-auth';

// export const getServerSideProps = requireAuthentication(
//   async (context: GetServerSidePropsContextWithUser) => {
//     return {
//       props: {
//         user: context.user,
//       },
//     };
//   },
// );

// interface Props {
//   user: User;
//   opinion: any
//   issueId: any
// }

// const EditProfile = (props: Props) => {

const OpinionBox = (props: Props) => {
  const { opinion, issueId }
  const { data, refetch: refetchOpinion } = useQuery(GET_OPINION_REACTS_AND_COMMENTS, {
    variables: { id: opinion.id },
  });
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);

  const router = useRouter();

  const likeCount = data && data.opinions && data.opinions[0].opinionReactsSum;
  const commentCount = data && data.opinions && data.opinions[0].opinionCommentsSum;

  // const AuthUser = useAuthUser();
  const userId = props.user.id;

  const myReact =
    opinion &&
    opinion.opinionReacts.length &&
    opinion.opinionReacts.filter(react => react.usersId === Number(userId));

  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  useEffect(() => {
    refetchOpinion({ id: opinion.id });
  }, []);

  const handleClickLike = async () => {
    try {
      await doLikeActionToOpinion({
        variables: {
          userId: Number(userId),
          opinionsId: Number(opinion.id),
          like: isLikedByMe ? false : true,
        },
      }).then(() => {
        refetchOpinion({ id: opinion.id });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const isContentOver = opinion?.content?.length > 128;
  const cutContent = isContentOver ? opinion?.content?.slice(0, 128) + '···' : opinion.content;

  return (
    <div
      className={s.commentBox}
 => {
        if (userId) {
          router.push({
            pathname: `/issues/${issueId}/opinions/${opinion.id}`,
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
          <div className={s.ago}>{getPubDate(opinion.createdAt)}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruits[opinion.stance.orderNum] + ' ' + opinion.stance.title}
          </span>
          <p className={s.commentContent} style={{ marginLeft: '5px' }}>
            {cutContent}
            {isContentOver && <span className={s.commentSeeMore}>더보기</span>}
          </p>
        </div>
        <div className={s.likeWrapper}>
          {isLikedByMe ? (
            <label style={{ color: '#4494FF', cursor: 'pointer', display: 'inline-flex' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                alt="좋아요 버튼"
                onClick={() => handleClickLike()}
                style={{ marginRight: '4px' }}
              />{' '}
              <span style={{ marginRight: '7px', color: '#4494FF' }}>{likeCount}</span>
            </label>
          ) : (
            <label style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="좋아요 버튼"
                style={{ marginRight: '4px' }}
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
