import Link from 'next/link';

const link_style = {
  marginRight: 15
};

const header_style = {
  position: 'absolute',
  top: 0,
};

const Header = () => (
    <div style={header_style}>
      <Link href="/">
        <a style={link_style}>Home</a>
      </Link>
      <Link href="/profile">
        <a style={link_style}>Profile</a>
      </Link>
      <Link href="/issue">
        <a style={link_style}>Issue 관리</a>
      </Link>
    </div>
);

export default Header;
