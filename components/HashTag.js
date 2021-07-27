import s from './Utils.module.scss';

const HashTag = ({ tag, count }) => {
  return (
    <div className={s.tag} key={tag}>
      #{tag} {count}
    </div>
  );
};

export default HashTag;
