import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import FloatingNewOpinionBtn from '../../components/opinion/FloatingNewOpinionBtn';

import Link from 'next/link';
import _ from 'lodash';

const initialProps = {
  tags: ['국내정치', '검찰개혁', '추윤갈등'],
  issues: [
    {
      title: '타이틀 타이틀 타이틀 타이틀 타이틀 타이틀 타이틀 타이틀',
    },
  ],
};

const RelatedIssues = props => {};

export default RelatedIssues;
