import s from './Utils.module.scss';

const HashTag = ({ tag, count }) => {
  return (
    <div key={tag} className={s.tag}>
      #{tag} {count}
    </div>
  );
};

export default HashTag;
