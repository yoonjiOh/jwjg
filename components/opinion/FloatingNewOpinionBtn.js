import Link from 'next/link';

const link_style = {
  marginRight: 15,
};

const footer_style = {
  position: 'fixed',
  bottom: 0,
  width: '360px',
};

const icon_style = {
  display: 'block',
  float: 'right',
  cursor: 'pointer',
}

const FloatingNewOpinionBtn = () => (
  <div style={footer_style}>
    <Link href="/opinions/new">
      <img style={icon_style}
        src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/addPostBtn.png"
        alt="add post button"
      />
    </Link>
  </div>
);

export default FloatingNewOpinionBtn;
