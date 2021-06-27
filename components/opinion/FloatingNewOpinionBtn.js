import { useRouter } from 'next/router';

const link_style = {
  marginRight: 15,
};

const footer_style = {
  position: 'fixed',
  bottom: 0,
  marginLeft: 290,
};

const icon_style = {
  display: 'block',
  float: 'right',
  cursor: 'pointer',
}

const FloatingNewOpinionBtn = ({ userId, issueId, stancesId }) => {
  const router = useRouter();

  return (
    <div style={footer_style}>
      <img
        style={icon_style}
        src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/add_post_btn.svg"
        alt="add post button"
        onClick={() => {
          router.push({
            pathname: '/opinions/new',
            query: { userId, issueId, stancesId },
          });
        }}
      />
    </div>
  );
};

export default FloatingNewOpinionBtn;
