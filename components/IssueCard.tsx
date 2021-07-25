import React from 'react';
import s from './IssueCard.module.scss';
import Link from 'next/link';
import _ from 'lodash';
import CurrentStances from './issue/CurrentStances';

function IssueCard({ issue }) {
  return (
    <section key={issue.id} className={s.issueCard}>
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
        <CurrentStances
          userStances={issue.userStances}
          stances={issue.newStances}
<<<<<<< HEAD
          withStats={false}
          onStanceClick={() => console.log('TODO:implement this.')}
=======
          withStats={false} // @ts-ignore
          onStanceClick={null}
>>>>>>> 2a2563141ba6a6af71575f60593f71e9e1bd13e6
        />
        <span className={s.responseSum}>🔥 참여 {issue.userStancesSum}</span>
        <span className={s.commentSum}>💬 의견 {issue.opinionsSum}</span>
      </div>
    </section>
  );
}

export default IssueCard;
