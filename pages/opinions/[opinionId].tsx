import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../../apollo/apolloClient';
import Layout from '../../components/Layout';
import CommentBox from '../../components/CommentBox';

import { useRouter } from 'next/router';

import s from './[opinionId].module.css';
import util_s from '../../components/Utils.module.scss';
import user_s from '../users/users.module.scss';
import { DO_LIKE_ACTION_TO_OPINION } from '../../lib/graph_queries';

import _ from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { fruits } from '../../utils/getFruitForStanceTitle';
import { getPubDate } from '../../lib/util';
import { parseCommentContent } from '../../utils/parseContent';

import {
  GetServerSidePropsContextWithUser,
  requireAuthentication,
} from '../../lib/requireAuthentication';
import { User } from 'next-auth';
import { GET_OPINIONS } from '../../lib/graph_queries';

const CREATE_OPINION_COMMENT = gql`
  mutation createOpinionComment(
    $content: String!
    $userId: String!
    $opinionsId: Int!
    $stancesId: Int!
  ) {
    createOpinionComment(
      content: $content
      userId: $userId
      opinionsId: $opinionsId
      stancesId: $stancesId
    ) {
      id
    }
  }
`;

const GET_MY_STANCE = gql`
  query myStance($issuesId: Int, $userId: String) {
    myStance(issuesId: $issuesId, userId: $userId) {
      userId
      issuesId
      stancesId
      stances {
        id
        title
        orderNum
      }
    }
  }
`;

const CREATE_USER_STANCE = gql`
  mutation createUserStance($userId: String, $issuesId: Int, $stancesId: Int) {
    createUserStance(userId: $userId, issuesId: $issuesId, stancesId: $stancesId) {
      userId
      issuesId
      stancesId
    }
  }
`;

export const getServerSideProps = requireAuthentication(
  async (context: GetServerSidePropsContextWithUser) => {
    const apolloClient = initializeApollo();
    const { data } = await apolloClient.query({
      query: GET_OPINIONS,
      variables: { id: +context.query.opinionId },
    });
    return {
      props: {
        user: context.user,
        data: data,
      },
    };
  },
);

interface Props {
  user: User;
  data: any;
}

const Opinion = (props: Props) => {
  const [opinionComment, setOpinionComment] = useState('');

  const [createOpinionComment] = useMutation(CREATE_OPINION_COMMENT);
  const [doLikeActionToOpinion] = useMutation(DO_LIKE_ACTION_TO_OPINION);
  const [createUserStance] = useMutation(CREATE_USER_STANCE);

  const router = useRouter();
  const { opinionId: opinionId } = router.query;
  const issueId = _.head(props.data.opinions).issuesId;
  const opinion = _.head(props.data.opinions);

  const userId = props.user.id;

  const { data: myStanceData } = useQuery(GET_MY_STANCE, {
    variables: {
      issuesId: issueId,
      userId: userId,
    },
  });

  const myReact = opinion && opinion.opinionReacts.filter(react => react.userId === userId);
  const isLikedByMe = !_.isEmpty(myReact) && _.head(myReact).like;

  const handleChangeCommentInput = e => {
    setOpinionComment(e.target.value);
  };

  const handleRegisterOpinionComment = async () => {
    if (!opinionComment) {
      window.alert('????????? ????????? ?????????.');
      return;
    }
    try {
      await createOpinionComment({
        variables: {
          content: opinionComment,
          userId,
          opinionsId: Number(opinionId),
          stancesId: myStanceData.myStance.stancesId,
        },
      }).then(() => router.reload());
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickLike = async () => {
    try {
      await doLikeActionToOpinion({
        variables: {
          userId,
          opinionsId: Number(opinionId),
          like: isLikedByMe ? false : true,
        },
      }).then(() => router.reload());
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickCommentIcon = () => {
    // @ts-ignore
    document.getElementById('input_comment').select();
  };

  const onStanceClick = async stancesId => {
    await createUserStance({
      variables: {
        userId: userId,
        issuesId: Number(issueId),
        stancesId,
      },
    })
      .then(() => router.reload())
      .catch(err => console.error(err));
  };

  return (
    <Layout title={'?????? ???????????? ?????????'} headerInfo={{ headerType: 'common' }} isDimmed={false}>
      <main className={s.main}>
        <div className={s.opinionWrapper}>
          <div className={util_s[`stanceMark-${opinion.stance.orderNum}`]} />
          <div className={s.opinionContent} style={{ position: 'relative' }}>
            <div
              className={user_s.smallProfileWrapper}
              style={{ height: '75px', paddingLeft: '0' }}
            >
              <div>
                <img src={opinion.user.image} />
              </div>
              <div className={user_s.profileInfo}>
                <p className={user_s.name}>{opinion.user.nickname}</p>
                <p className={user_s.ago}>{getPubDate(opinion.createdAt)}</p>
              </div>
            </div>

            <div className={s.stancesWrapper}>
              {fruits[opinion.stance.orderNum]}&nbsp;&nbsp;{opinion.stance.title}
            </div>
            <div
              className={s.content}
              dangerouslySetInnerHTML={{ __html: parseCommentContent(opinion.content) }}
            ></div>
            <div className={s.likeWrapper}>
              {isLikedByMe ? (
                <div style={{ color: '#4494FF', cursor: 'pointer', display: 'inline-flex' }}>
                  <img
                    src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                    alt="????????? ??????"
                    style={{ marginRight: '3px' }}
                  />{' '}
                  {opinion.opinionReactsSum}
                </div>
              ) : (
                <label style={{ cursor: 'pointer' }}>
                  <img
                    src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                    alt="????????? ??????"
                    style={{ marginRight: '5px' }}
                  />{' '}
                  {opinion.opinionReactsSum}
                </label>
              )}

              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg"
                alt="?????? ?????? ??????"
                style={{ marginLeft: '15px', marginRight: '5px' }}
              />
              {opinion.opinionComments.length}
            </div>
          </div>
        </div>

        <div className={s.actionsWrapper}>
          <div className={s.action} onClick={handleClickLike}>
            {isLikedByMe ? (
              <label style={{ color: '#4494FF', cursor: 'pointer' }}>
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/blue_like.svg"
                  alt="????????? ??????"
                />{' '}
              </label>
            ) : (
              <label style={{ cursor: 'pointer' }}>
                <img
                  src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
                  alt="????????? ??????"
                  style={{ marginRight: '5px' }}
                />{' '}
              </label>
            )}
          </div>
          <div className={s.action} onClick={handleClickCommentIcon}>
            <img
              src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg"
              alt="?????? ?????? ??????"
            />
            <span>?????? ??????</span>
          </div>
          <CopyToClipboard text={`https://jwjg.kr/issues/${issueId}opinions/${opinionId}`}>
            <div className={s.action}>
              <img
                src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/share.svg"
                alt="???????????? ??????"
              />
              <span>????????????</span>
            </div>
          </CopyToClipboard>
        </div>

        <div className={s.commentsWrapper}>
          {opinion.opinionComments &&
            opinion.opinionComments.map(comment => (
              <CommentBox comment={comment} me={{ id: userId }} key={comment.id} />
            ))}

          <div style={{ height: '90px' }}></div>
        </div>

        {myStanceData && myStanceData.myStance ? (
          <div className={s.commentWrapper}>
            <div className={s.commentInputWrapper}>
              <textarea
                id="input_comment"
                onChange={handleChangeCommentInput}
                value={opinionComment}
                placeholder="????????? ???????????????.."
              />
              <button onClick={handleRegisterOpinionComment}>??????</button>
            </div>
          </div>
        ) : (
          <div className={s.stanceSelectorWrapper}>
            <div className={s.guide}>????????? ????????? ???, ????????? ???????????????..</div>
            <div className={s.stanceWrapper}>
              {opinion.issueStances.map(stance => (
                <div className={s.stance} key={stance.id} onClick={() => onStanceClick(stance.id)}>
                  {fruits[stance.orderNum]}&nbsp;&nbsp;
                  {stance.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Opinion;
