import React from 'react';
import s from './IssueCard.module.scss';
import Link from 'next/link';
import _ from 'lodash';

function IssueCard(props) {
  const { issue, userId } = props;
  return (
    <section key={issue.id} className={s.issueCard}>
      <h3 className={s.issueTitle}>
        <Link key={issue.title} href={`/issues/${issue.id}?userId=${userId}`}>
          {issue.title}
        </Link>
      </h3>
      <div className={s.image}>
        <img src={issue.imageUrl} />
      </div>
      <div className={s.barchart}>
        {_.map(issue.newStances, userStance => {
          const ratio = (userStance.sum / issue.userStancesSum) * 100 + '%';
          return (
            <div
              key={userStance.title}
              className={`${s.stanceItemBarChart} ${s[userStance.fruit]}`}
              style={{ width: ratio }}
            ></div>
          );
        })}
      </div>
      <div style={{ padding: '0 16px 20px' }}>
        <h3 className={s.issueTitle}>
          <Link key={issue.title} href={`/issues/${issue.id}`}>
            {issue.title}
          </Link>
        </h3>
        <span className={s.responseSum}>🔥 {issue.userStancesSum}명 참여</span>
        <span className={s.commentSum}>💬 글 {issue.opinionsSum}개</span>
      </div>
    </section>
  );
}

export default IssueCard;
