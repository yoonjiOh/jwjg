import React from 'react';
import s from './IssueCard.module.scss';
import Link from 'next/link';

function IssueCard(props) {
  const { issue } = props;
  return (
    <section key={issue.id} className={s.issueCard}>
      <h3 className={s.issueTitle}>
        <Link key={issue.title} href={`/issues/${issue.id}`}>
          {issue.title}
        </Link>
      </h3>
      <div className={s.image}>
        <img src={issue.imageUrl} />
      </div>
      <div>
        <div className={s.issueCardTop}>
          <p className={s.responseSum}>🔥 {''}명 참여</p>
          <p className={s.barchart}></p>
        </div>
        <div className={s.line}></div>
        <div className={s.issueCardCommentWrap}>
          <p className={s.commentSum}>💬 글 {''}개</p>
          {issue.opinions.length > 0 && issue.opinions[1] && (
            <div className={s.issueCardComments}>
              <div className={s.issueCardComment}>
                <p>{issue.opinions[0]?.author_id}</p>
                <p>{issue.opinions[0]?.content}</p>
              </div>
              <div className={s.issueCardComment}>
                <p>{issue.opinions[1]?.author_id}</p>
                <p>{issue.opinions[1]?.content}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default IssueCard;
