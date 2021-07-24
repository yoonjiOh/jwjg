import Head from 'next/head';
import s from './Layout.module.css';
import CommonHeader from './CommonHeader';
import EditModeHeader from './EditModeHeader';

const Layout = ({ title, headerInfo, children, isDimmed }) => {
  const isCommonHeader = headerInfo.headerType === 'common';
  const isEditModeHeader = headerInfo.headerType === 'editMode';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className={isDimmed ? s.container + ' loading-transparent-overlay' : s.container}>
        {isCommonHeader && <CommonHeader isDimmed={isDimmed} />}
        {isEditModeHeader && (
          <EditModeHeader
            subTitle={headerInfo.subTitle}
            action={headerInfo.action}
            isDimmed={isDimmed}
          />
        )}
        {children}
      </div>
    </>
  );
};

export default Layout;
