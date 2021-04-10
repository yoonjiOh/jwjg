import Head from 'next/head';
import s from './Layout.module.css';
import CommonHeader from './CommonHeader';
import EditModeHeader from './EditModeHeader';

const Layout = ({ title, headerInfo, children }) => {
  const isCommonHeader = headerInfo.headerType === 'common';
  const isEditModeHeader = headerInfo.headerType === 'editMode';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={s.container}>
        {isCommonHeader && <CommonHeader />}
        {isEditModeHeader && <EditModeHeader subTitle={headerInfo.subTitle} action={headerInfo.action} />}
        {children}
      </div>
    </>
  );
};

export default Layout;
