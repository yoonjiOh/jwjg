import Link from 'next/link';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    marginLeft: 16,
    cursor: 'pointer',
  },
};

const link_style = {
  marginRight: 15,
};

const header_style = {
  position: 'absolute',
  top: 0,
};

const Header = ({ email, signOut }) => (
  <div style={header_style}>
    <Link href="/">
      <a style={link_style}>Home</a>
    </Link>
    {email ? (
      <>
        <button
          type="button"
          onClick={() => {
            signOut();
          }}
          style={styles.button}
        >
          로그아웃
        </button>
      </>
    ) : (
      <>
        <Link href="/users">
          <a>
            <button type="button" style={styles.button}>
              로그인
            </button>
          </a>
        </Link>
      </>
    )}
    <Link href="/users/profile">
      <a style={link_style}>Profile</a>
    </Link>
    <Link href="/admin">
      <a style={link_style}>Issue 관리</a>
    </Link>
  </div>
);

export default Header;
