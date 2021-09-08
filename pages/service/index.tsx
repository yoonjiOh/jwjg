import React from 'react';
import Layout from '../../components/Layout';
import s from './index.module.scss';

function ServiceTitle() {
  const capybara1Img = "https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/Capybara1.png";

  return (
    <div className={s.serviceTitleWrap}>
      <div className={s.image}>
        <img src={capybara1Img} />
      </div>
      <div className={s.wrap}>
        <h3 className={s.serviceTitle}>
          우리 이제 화해해요! <br />
          서로를 이해하는 이슈 SNS,<br />
          좌우지간<br />
        </h3>
      </div>
    </div>
  )
}

function ServiceHello() {
  return (
    <div className={s.serviceWrap}>
      <div className={s.wrap}>
        <h3 className={s.serviceSubTitle}>
          👋 반가워요!
        </h3>
        <h2 className={s.serviceContent}>
          사회의 다양한 이슈를 토론하며, 차이를 좁혀나가는 이슈 SNS 좌우지간에 오신 것을 환영합니다.
        </h2>
      </div>
    </div>
  )
}

function ServiceCriteria() {
  return (
    <div className={s.serviceWrap}>
      <div className={s.wrap}>
        <h3 className={s.serviceSubTitle}>
          🤔 어떤 기준으로 이슈를 선정하나요?
        </h3>
        <h2 className={s.serviceContent}>
          우리는 다음 세 가지를 기준으로 이슈를 선정해요.
        </h2>
        <div className={s.wrap}>
          <h3 className={s.title}>
            ㆍ 공익성
          </h3>
          <h2 className={s.content}>
            함께 논의할 가치가 있는 이슈일까?
          </h2>
          <h3 className={s.title}>
            ㆍ 재미
          </h3>
          <h2 className={s.content}>
            이 이슈를 함께 논의하면 재미있을까?
          </h2>
          <h3 className={s.title}>
            ㆍ 시의성
          </h3>
          <h2 className={s.content}>
            지금 논의하기 좋은 이슈일까?
          </h2>
        </div>
        <h2 className={s.serviceContent}>
          지금은 좌우지간 팀원들이 토의해서 주제를 선정하고 있어요.
          서비스가 더 발전하면, 이슈 선정 방법도 개선해 나갈 예정이랍니다.
        </h2>
      </div>
    </div>
  );
}

function ServiceSpecial() {
  return (
    <div className={s.serviceWrap}>
      <div className={s.wrap}>
        <h3 className={s.serviceSubTitle}>
          🤔 어떤 점이 특별하죠?
        </h3>
        <h2 className={s.serviceContent}>
          좌우지간의 특별한 점은,
        </h2>
        <div className={s.wrap}>
          <h3 className={s.title}>
            👀 MZ세대의 눈높이에 맞는 이슈
          </h3>
          <h2 className={s.content}>
            너무 정치적인 이슈는 재미가 없잖아요.
            그래서 정말 우리가 관심있을 이슈를 소개합니다.
            나와 관련있는 이슈에 대해 토론하다 보면,
            사회와 정치에 대한 견해도 무럭무럭 자랄 거예요 😊
          </h2>
          <h3 className={s.title}>
            🗳 입장 투표, 의견 작성
          </h3>
          <h2 className={s.content}>
            이 이슈를 어떻게 생각하는지, 내 입장을 투표할 수 있습니다.
            그리고 꼭 투표를 해야 의견을 쓸 수 있어요.
            다른 친구들이 투표한 현황을 확인하면 지금 여론이 한 눈에 보인답니다.
            또, 토론에 참여하는 친구가 어떤 입장인지 바로 확인할 수 있어요.
          </h2>
          <h3 className={s.title}>
            💐 편식 없이! 골고루 의견 보기
          </h3>
          <h2 className={s.content}>
            보통 뉴스 댓글창은 정치색이 강하죠? 한 쪽으로 치우친 댓글만 목록에 가득합니다.
            우리는 서로 다른 생각을 건강하게 나누고 싶었어요. 그래서 좌우지간에서는 의견을 추천 순으로 정렬하지 않아요.
            여러 입장을 골고루 정렬하죠. 다양한 관점을 통해 시야를 넓혀 봐요!
          </h2>
        </div>
        <h2 className={s.serviceContent}>
          좌우지간은 이 세 가지를 시작으로 장점을 늘려 갈 예정입니다. 열심히 준비 중이니, 조금만 기다려 주세요!
        </h2>
      </div>
    </div>
  );
}

function ServiceCapybara() {
  const copybara2Img = "https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/Capybara2.png";

  return (
    <div className={s.serviceWrap}>
      <div className={s.wrap}>
        <h3 className={s.serviceSubTitle}>
          🐭 근데 이 쥐는 뭐예요?
        </h3>
        <div className={s.image}>
          <img src={copybara2Img} />
        </div>
        <h2 className={s.serviceContent}>
          아… 쥐라뇨! 이 귀여운 갈색 동물은 카피바라라고요. 성격이 아주 순둥이라 동물 사이에서 인싸로 통합니다.
          고양이, 악어랑도 잘 지낼 정도래요.‘공존’이라는 가치를 담은 좌우지간 마스코트 카피바라! 앞으로 친하게 지내 주세요.
        </h2>
      </div>
    </div>
  );
}

function ServiceImprovement() {
  return (
    <div className={s.serviceWrap}>
      <div className={s.wrap}>
        <h3 className={s.serviceSubTitle}>
          🤔 버그가 좀 보이네요?👀 <br />
          그리고 이런 기능도 있으면 좋을 것 같은데요?!
        </h3>
        <h2 className={s.serviceContent}>
          자세히 봐 주셔서 너무 감사해요.
          혹시 버그를 발견하셨거나, ‘이 기능은 꼭 필요해요!!’하는 아이디어가 있으시면 <a href="#">여기</a>로 알려주세요.
          정말 정말 정말 감사해요!!!!
          <br /><br />
          좌우지간 팀 드림
        </h2>
      </div>
    </div>
  );
}

const serviceInfo = () => {
  return (
    <Layout title={'서비스 소개'} headerInfo={{ headerType: 'common' }} isDimmed={false} >
      <main className={s.main}>
        <ServiceTitle />
        <ServiceHello />
        <ServiceCriteria />
        <ServiceSpecial />
        <ServiceCapybara />
        <ServiceImprovement />
      </main>
    </Layout >
  );
};

export default serviceInfo;