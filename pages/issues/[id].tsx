import s from './[id].module.scss';

import { useRouter } from 'next/router';
import React from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { withApollo } from '../../apollo/client';

import Layout from '../../components/Layout';
import Link from 'next/link';
import _ from 'lodash';

const GET_ISSUE = gql`
  query issues($id: Int!) {
    issues(id: $id) {
      id
      title
      content
      imageUrl
      stances {
        id
        title
      }
      userStances {
        usersId
        stancesId
      }
      opinions {
        id
        content
        stancesId
        createdAt
        usersId
        stance {
          id
          title
        }
        user {
          id
          name
          intro
          profileImageUrl
        }
        opinionReacts {
          like
        }
        opinionComments {
          id
          content
          usersId
          user {
            id
            name
            intro
            profileImageUrl
          }
        }
      }
      issueHashTags {
        hashTags {
          content
        }
      }
    }
  }
`;

const CREATE_USER_STANCE = gql`
  mutation createUserStance($usersId: Int, $issuesId: Int, $stancesId: Int) {
    createUserStance(usersId: $usersId, issuesId: $issuesId, stancesId: $stancesId) {
      usersId
      issuesId
      stancesId
    }
  }
`;

const Issue = () => {
  const router = useRouter();
  const issue_id = Number(router.query.id);
  const { loading, error, data } = useQuery(GET_ISSUE, {
    variables: { id: issue_id },
  });
  const [createUserStance] = useMutation(CREATE_USER_STANCE);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  const issue = data.issues[0];
  const tags = issue.issueHashTags.map(issueHashTag => issueHashTag.hashTags[0].content);
  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];
  const userStances = _.reduce(
    issue.userStances,
    (acc, userStance) => {
      if (acc[userStance.stancesId]) {
        acc[userStance.stancesId] += 1;
      } else {
        acc[userStance.stancesId] = 1;
      }
      return acc;
    },
    {},
  );
  const stances = issue.stances.map((stance, index) => ({
    ...stance,
    fruit: fruitsForStanceTitle[index],
    title: fruitsForStanceTitle[index] + ' ' + stance.title,
    userStanceCount: userStances[stance.id] ? userStances[stance.id] : 0,
  }));
  const isStanceEmpty = issue.userStances.length === 0;
  const sortedUserStances = _.sortBy(stances, stance => stance.userStanceCount);
  const getIsStanceTied = () => {
    return (
      sortedUserStances[sortedUserStances.length - 1].userStanceCount ===
      sortedUserStances[sortedUserStances.length - 2].userStanceCount
    );
  };
  const isStanceTied = getIsStanceTied();
  const onStanceClick = async stancesId => {
    const func = await createUserStance({
      variables: {
        // TODO: usersId 상태 가져오는 법 확인 필요
        usersId: 0,
        issuesId: issue.id,
        stancesId,
      },
    });
    _.debounce(func, 250);
  };
  return (
    <Layout title={'개별 이슈'}>
      <main className={s.main}>
        <div className={s.image}>
          <img src={issue.imageUrl} />
        </div>
        <div className={s.issueBody}>
          <div className={s.tags}>
            <ol>
              {tags.map((tag, idx) => (
                <li id={tag + idx}>{tag}</li>
              ))}
            </ol>
          </div>
          <h2 className={s.issueTitle}>{issue.title}</h2>
          <div className={s.issueSum}>
            <p>🔥 참여 {issue.stances.length}</p>
            <p>💬 의견 {issue.opinions.length}</p>
          </div>
          <hr />
          {issue.content && (
            <div>
              <h3 className={s.title}>이슈의 맥</h3>
              <p>{issue.content}</p>
              {/* TODO: issue 작성자 추가 */}
            </div>
          )}
          <div>
            <h3 className={s.title}>지금 여론</h3>
            {isStanceEmpty ? (
              <div>
                <p>아직 참여한 사람이 없어요 😣 이 이슈에 제일 먼저 참여해 보세요!</p>
                <div>내 입장 남기기</div>
              </div>
            ) : isStanceTied ? (
              <p>
                <span>{sortedUserStances[sortedUserStances.length - 1].title}</span> 입장과{' '}
                <span>{sortedUserStances[sortedUserStances.length - 2].title}</span> 입장이 각각{' '}
                <span>
                  {(sortedUserStances[sortedUserStances.length - 1].userStanceCount * 100) /
                    issue.userStances.length}
                  %
                </span>
                로 동률이에요!
              </p>
            ) : (
              <p>
                <span>{sortedUserStances[sortedUserStances.length - 1].title}</span> 입장이 전체의{' '}
                <span>
                  {(sortedUserStances[sortedUserStances.length - 1].userCount * 100) /
                    issue.userStances.length}
                  %
                </span>
                로 가장 많아요
              </p>
            )}
            <ul className={s.stanceItems}>
              {stances.map(stance => (
                <li className={s.stanceItem} key={stance.id}>
                  <div
                    className={`${s.stanceItemBarChart} ${s[stance.fruit]}`}
                    style={{
                      width: `${(stance.userStanceCount * 100) / issue.userStances.length}%`,
                    }}
                  >
                    {}
                  </div>
                  <div className={s.stanceItemTitle}>{stance.title}</div>
                  <div className={s.stanceItemPercentage}>
                    {userStances[stance.id] > 0
                      ? (userStances[stance.id] * 100) / issue.userStances.length
                      : 0}
                    %
                  </div>
                </li>
              ))}
            </ul>
            <div className={s.stanceCount}>{issue.userStances.length}명이 참여했어요</div>
          </div>
          <div>
            <h3 className={s.title}>내 입장</h3>
            <ul className={s.stancePickItems}>
              {stances.map(stance => (
                // TODO: userStances에 저장된 값이 있다면, 선택된 것으로 표시되어야 함
                <li
                  className={s.stancePickItem}
                  key={stance.id}
                  onClick={() => onStanceClick(stance.id)}
                >
                  {stance.title}
                </li>
              ))}
            </ul>
          </div>
          <div className={s.opinionTitleContainer}>
            <h3 className={s.title}>의견</h3>
            <p className={s.opinionSum}>{issue.opinions.length}</p>
            <div className={s.opinionNext}></div>
          </div>
          <div>
            <div>
              {issue.opinions.map(opinion => (
                <div>
                  <section>
                    <h4>{opinion.stance.title}</h4>
                    <div>
                      <span>{opinion.user.name}</span>
                    </div>
                    <div>
                      <div>{opinion.content}</div>
                      {/* <span>더보기</span> */}
                      {/* TODO: 일부 글자만 표시하고 페이지 넘어가도록 */}
                    </div>
                  </section>
                  <div>
                    <div>
                      좋아요
                      <span>
                        {opinion.opinionReacts.like == null ? 0 : opinion.opinionReacts.like} 개
                      </span>
                    </div>
                  </div>
                  <div>
                    <div>
                      댓글
                      <span>{opinion.opinionComments.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link href={`/issues/${issue_id}/opinions`}>모두 보기</Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default withApollo(Issue);
