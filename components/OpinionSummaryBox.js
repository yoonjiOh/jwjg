import s from '../pages/users/users.module.scss';
import _ from 'lodash';

import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { GET_OPINION_REACTS_AND_COMMENTS } from '../lib/queries';
import { fruits } from '../utils/getFruitForStanceTitle';

const OpinionSummaryBox = ({ opinion, issues, stances }) => {
  const { data } = useQuery(GET_OPINION_REACTS_AND_COMMENTS, { variables: { id: opinion.id } });
  const router = useRouter();

  const matchIssue = _.find(issues, issue => {
    return issue.id === opinion.issuesId;
  });
  const matchStance = _.find(stances, stance => {
    return stance.id === opinion.stancesId;
  });

  return (
    <div
      key={opinion.id}
      className={s.opinionSummaryBox}
      onClick={() => {
        router.push({
          pathname: `/opinions/${opinion.id}`,
        });
      }}
    >
      <div className={s.issueImgBox}>
        <img src={matchIssue.imageUrl} />
      </div>
      <div className={s.contextBox}>
        <p className={s.title}>{matchIssue.title}</p>
        <p className={s.content}>
          <span className={s.stanceTitle}>
            {fruits[matchStance.orderNum]} {matchStance.title}
          </span>
          {opinion.content.substring(0, 100) + '...'}
        </p>

        <div className={s.likeWrapper}>
          <img
            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
            alt="좋아요 버튼"
          />
          <span style={{ marginLeft: '5px', marginRight: '10px' }}>
            {data && data.opinions && data.opinions[0].opinionReactsSum}
          </span>

          <img src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg" alt="코멘트" />
          <span style={{ marginLeft: '5px' }}>
            {data && data.opinions && data.opinions[0].opinionCommentsSum}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpinionSummaryBox;
