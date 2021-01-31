import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
    <div>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
      <Link href="/profile">
        <a style={linkStyle}>Profile</a>
      </Link>
      <Link href="/issue">
        <a style={linkStyle}>Issue 관리</a>
      </Link>
    </div>
);

export default Header;
