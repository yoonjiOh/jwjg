import React from 'react';
import s from './IssueCard.module.scss';
import Link from 'next/link';

function ServiceCard() {
  const copybara1Img = "https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/Capybara1.png";

  return (
    <section className={s.issueCard}>
      <Link href={`/service`}>
        <div className={s.image}>
          <img src={copybara1Img} />
        </div>
      </Link>
      <div style={{ padding: '0 16px 20px' }}>
        <h3 className={s.issueTitle}>
          <Link href={'/service'}>
            근데...좌우지간이 뭐에요?
          </Link>
        </h3>
        <Link href={'/service'}>
          소개합니다. 싸우기 싫은 이슈 SNS 좌우지간!
        </Link>
      </div>
    </section>
  );
}

export default ServiceCard;