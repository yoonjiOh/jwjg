import s from './CurrentStances.module.scss';
import _ from 'lodash';

const CurrentStances = props => {
  const { userStances, stances } = props;
  const userStancesSum = userStances?.length || 0;
  const sortedUserStances = _.chain(stances)
    .sortBy(stance => stance.count)
    .reverse()
    .value();
  const isStanceTied = (() => {
    if (userStancesSum < 1) return false;
    if (sortedUserStances[0].count !== sortedUserStances[1].count) return false;
    let tiedStanceSum = 0;
    for (let i = 1; i < sortedUserStances.length; i++) {
      if (sortedUserStances[i - 1].count === sortedUserStances[i].count) {
        tiedStanceSum += 1;
      }
    }
    return tiedStanceSum;
  })();
  return (
    <div>
      <h3 className={s.title}>지금 여론</h3>
      {userStancesSum < 1 ? (
        <div>
          <p>아직 참여한 사람이 없어요 😣 이 이슈에 제일 먼저 참여해 보세요!</p>
          <div>내 입장 남기기</div>
        </div>
      ) : isStanceTied ? (
        <p className={s.comment}>
          {sortedUserStances
            .filter((_e, i) => i <= isStanceTied)
            .map((s, i) => {
              if (i < isStanceTied) {
                return (
                  <>
                    <span key={s.title}>{s.title}</span> 입장과{' '}
                  </>
                );
              } else {
                return (
                  <>
                    <span key={s.title}>{s.title}</span> 입장이 각각{' '}
                  </>
                );
              }
            })}
          <span>
            {/* FIXME: 소수점 아래 몇째자리까지 보여줘야 할지 고려가 필요함. */}
            {((sortedUserStances[0].count * 100) / userStancesSum).toFixed(1)}%
          </span>
          로 동률이에요!
        </p>
      ) : (
        <p className={s.comment}>
          <span>{sortedUserStances[0].title}</span> 입장이 전체의{' '}
          <span>{((sortedUserStances[0].count * 100) / userStancesSum).toFixed(1)}%</span>로 가장
          많아요
        </p>
      )}
      <ul className={s.stanceItems}>
        {sortedUserStances.map(stance => (
          <li className={s.stanceItem} key={stance.id}>
            <div
              className={`${s.stanceItemBarChart} ${s[stance.fruit]}`}
              style={{
                width: `${((stance.count * 100) / userStancesSum).toFixed(1)}%`,
              }}
            >
              {}
            </div>
            <div className={s.stanceItemTitle}>{stance.title}</div>
            <div className={s.stanceItemPercentage}>
              {stance.count > 0 ? ((stance.count * 100) / userStancesSum).toFixed(1) : 0}%
            </div>
          </li>
        ))}
      </ul>
      <div className={s.stanceCount}>{userStancesSum}명이 참여했어요</div>
    </div>
  );
};

export default CurrentStances;
