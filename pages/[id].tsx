import s from './[id].module.css';

import { useRouter } from 'next/router';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { withApollo } from '../apollo/client';

import Layout from '../components/Layout';

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
      opinions {
        id
      }
    }
  }
`;

const Issue = () => {
  const router = useRouter();
  const issue_id = Number(router.query.id);
  const { loading, error, data } = useQuery(GET_ISSUE, {
    variables: { id: issue_id },
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  const issue = data.issues[0];
  // const issue = {
  //   img_url: "",
  //   title: "추윤갈등",
  //   post: [{}, {}],
  //   response: [{}],
  // };
  // const response_result = {
  //   name: "name",
  //   count: 5,
  // };
  return (
    <Layout title={'개별 이슈'}>
      <main className={s.main}>
        <div className={s.image}>
          <img src={issue.imageUrl} />
        </div>
        <div className={s.issueBody}>
          <div className={s.tags}>
            <ol>
              <li>국내정치</li>
              <li>검찰개혁</li>
              <li>추윤갈등</li>
            </ol>
          </div>
          <h2 className={s.issueTitle}>{issue.title}</h2>
          <div className={s.issueSum}>
            <p>🔥 참여 {issue.stances.length}</p>
            <p>💬 의견 {issue.opinions.length}</p>
          </div>
          <div>
            <h3>지금 여론</h3>
            <p>
              <span>{}</span> 입장이 전체의 <span>{}%</span>로 가장 많아요👀
            </p>
            <ul>
              <li>{}</li>
              <li>{}</li>
              <li>{}</li>
              <li>{}</li>
              <li>{}</li>
            </ul>
          </div>
          <div>
            <h3>내 입장</h3>
            <ul>
              <li>{}</li>
              <li>{}</li>
              <li>{}</li>
              <li>{}</li>
              <li>{}</li>
            </ul>
          </div>
          <h3>의견</h3>
          <div>
            <div>
              <div>
                <section>
                  <h4>추미애 적극 지지</h4>
                  <div>
                    <span>김철수</span>
                    <span>한국경제 기자</span>
                  </div>
                  <div>
                    <div>
                      <p>blablablala~~~~~~~</p>
                      <p>blablablala~~~~~~~</p>
                    </div>
                    <span>더보기</span>
                  </div>
                </section>
                <div>
                  <div>
                    좋아요
                    <span>37</span>
                  </div>
                </div>
                <div>
                  <div>
                    댓글
                    <span>48</span>
                  </div>
                </div>
              </div>
              <div>
                <section>
                  <span>김철수</span>
                  <span>한국경제 기자</span>
                  <div>추미애 적극 지지</div>
                  <div>
                    <p>blablablala~~~~~~~</p>
                    <span>더보기</span>
                  </div>
                </section>
                <div>
                  <div>
                    좋아요
                    <span>37</span>
                  </div>
                </div>
                <div>
                  <div>
                    댓글
                    <span>48</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default withApollo(Issue);
