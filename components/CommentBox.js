import s from './Utils.module.scss';

const CommentBox = ({ comment }) => {
  console.log('comment', comment);
  return (
    <div className={s.commentBox} key={comment.id}>
      <div className={s[`stanceMark-${comment.stancesId}`]} />
      <div className={s.commentWrapper}>
        <div className={s.profileWrapper}>
          <div className={s.profilePlaceholder} />
          <div className={s.profileName}>{comment.user.name}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>🍋 추미애 비판적 지지</span>
          {' ' + comment.content}
        </div>
        <div className={s.likeWrapper}>
          <span style={{ marginRight: '10px' }}>좋아요</span>
          <img
            src="https://jwjg-icons.s3.ap-northeast-2.amazonaws.com/like.svg"
            alt="좋아요 버튼"
          />
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
