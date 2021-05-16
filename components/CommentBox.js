import s from './Utils.module.scss';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const CommentBox = ({ comment }) => {
  const fruitsForStanceTitle = ['🍎', '🍋', '🍇', '🍈', '🍊'];

  return (
    <div className={s.commentBox} key={comment.id}>
      <div className={s[`stanceMark-${comment.stancesId}`]} />
      <div className={s.commentWrapper}>
        <div className={s.profileWrapper}>
          <div className={s.profilePlaceholder} />
          <div className={s.profileName}>{comment.user.name}</div>
          <div className={s.ago}>{dayjs(comment.createdAt).fromNow()}</div>
        </div>
        <div className={s.commentContentWrapper}>
          <span className={s.commentStance}>
            {fruitsForStanceTitle[comment.stancesId] + comment.stance.title}
          </span>
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
