import s from '../pages/users/users.module.scss';
import _ from 'lodash';

import { gql, useQuery } from '@apollo/client';

const GET_OPINION_REACTS_AND_COMMENTS = gql`
  query opinion($id: Int!) {
    opinions(id: $id) {
      id
      opinionReactsSum
      opinionCommentsSum
    }
  }
`;

const OpinionSummaryBox = ({ opinion, issues, stances }) => {
  const { data } = useQuery(GET_OPINION_REACTS_AND_COMMENTS, { variables: { id: opinion.id } });

  const matchIssue = _.find(issues, issue => {
    return issue.id === opinion.issuesId;
  });
  const matchStance = _.find(stances, stance => {
    return stance.id === opinion.stancesId;
  });

  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  return (
    <div key={opinion.id} className={s.opinionSummaryBox}>
      <div className={s.issueImgBox}>
        <img src={matchIssue.imageUrl} />
      </div>
      <div className={s.contextBox}>
        <p className={s.title}>{matchIssue.title}</p>
        <p className={s.content}>
          <span className={s.stanceTitle}>
            {fruitsForStanceTitle[matchStance.orderNum]} {matchStance.title}
          </span>
          {opinion.content.substring(0, 100) + '...'}
        </p>

        <div className={s.likeWrapper}>
          <img
            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
            alt="좋아요 버튼"
          />
          <span style={{ marginLeft: '10px' }}>
            {data && data.opinions && data.opinions[0].opinionReactsSum}
          </span>

          <img src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/bubble.svg" alt="코멘트" />
          <span style={{ marginLeft: '10px' }}>
            {data && data.opinions && data.opinions[0].opinionCommentsSum}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OpinionSummaryBox;
