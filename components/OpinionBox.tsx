import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import s from './Utils.module.scss';
import { useRouter } from 'next/router';

import { GET_OPINION_REACTS_AND_COMMENTS, DO_LIKE_ACTION_TO_OPINION } from '../lib/graph_queries';

import _ from 'lodash';
import { fruits } from '../utils/getFruitForStanceTitle';
import { User } from 'next-auth';
import { getPubDate } from '../lib/util';

interface Props {
  user: User;
  opinion: any;
  issueId: any;
}

const OpinionBox = (props: Props) => {
  const { user, opinion, issueId } = props;
  const { data, refetch: refetchOpinion } = useQuery(GET_OPINION_REACTS_AND_COMMENTS, {
    variables: { id: opinion.id },
  });
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);

  const router = useRouter();

  const likeCount = data && data.opinions && data.opinions[0].opinionReactsSum;
  const commentCount = data && data.opinions && data.opinions[0].opinionCommentsSum;

  const userId = user.id;

  const myReact =
    opinion &&
    opinion.opinionReacts.length &&
    opinion.opinionReacts.filter(react => react.userId === userId);

  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  useEffect(() => {
    refetchOpinion({ id: opinion.id });
  }, []);

  const handleClickLike = async () => {
    try {
      await doLikeActionToOpinion({
        variables: {
          userId,
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
  const cutContent = isContentOver ? opinion?.content?.slice(0, 128) + 'ยทยทยท' : opinion.content;

  return (
    <div
      className={s.commentBox}
      key={opinion.id}
      onClick={() => {
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
            <img src={opinion.user.image} />
          </div>
          <div className={s.profileName}>{opinion.user.nickname}</div>
          <div className={s.ago}>{getPubDate(opinion.createdAt)}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruits[opinion.stance.orderNum] + ' ' + opinion.stance.title}
          </span>
          <p className={s.commentContent} style={{ marginLeft: '5px' }}>
            {cutContent}
            {isContentOver && <span className={s.commentSeeMore}>๋๋ณด๊ธฐ</span>}
          </p>
        </div>
        <div className={s.likeWrapper}>
          {isLikedByMe ? (
            <label style={{ color: '#4494FF', cursor: 'pointer', display: 'inline-flex' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                alt="์ข์์ ๋ฒํผ"
                onClick={() => handleClickLike()}
                style={{ marginRight: '4px' }}
              />{' '}
              <span style={{ marginRight: '7px', color: '#4494FF' }}>{likeCount}</span>
            </label>
          ) : (
            <label style={{ cursor: 'pointer', display: 'inline-flex' }}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                alt="์ข์์ ๋ฒํผ"
                style={{ marginRight: '4px' }}
                onClick={() => handleClickLike()}
              />{' '}
              <span style={{ marginRight: '7px' }}>{likeCount}</span>
            </label>
          )}

          <img src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg" alt="์ฝ๋ฉํธ" />
          <span style={{ marginLeft: '6px' }}>{commentCount}</span>
        </div>
      </div>
    </div>
  );
};

export default OpinionBox;
