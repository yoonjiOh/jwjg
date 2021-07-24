import s from './CurrentStances.module.scss';
import _ from 'lodash';

const CurrentStances = ({ userStances, stances, withStats, onStanceClick }) => {
  const userStancesByStanceId = userStances.reduce((acc, userStance) => {
    if (acc[userStance.stancesId]) {
      acc[userStance.stancesId] += 1;
    } else {
      acc[userStance.stancesId] = 1;
    }
    return acc;
  }, {});
  const newStances = stances.map(stance => {
    return {
      ...stance,
      title: stance.fruit + ' ' + stance.title,
      count: userStancesByStanceId[stance.id] ? userStancesByStanceId[stance.id] : 0,
    };
  });
  const userStancesSum = userStances?.length || 0;
  const sortedUserStances = _.chain(newStances)
    .sortBy(stance => stance.count)
    .reverse()
    .value();
  const getIsStanceTied = () => {
    if (userStancesSum < 1) return false;
    if (sortedUserStances[0].count !== sortedUserStances[1].count) return false;
    let tiedStanceSum = 0;
    for (let i = 1; i < sortedUserStances.length; i++) {
      if (sortedUserStances[i - 1].count === sortedUserStances[i].count) {
        tiedStanceSum += 1;
      }
    }
    return tiedStanceSum;
  };
  const isStanceTied = getIsStanceTied();
  return (
    <div>
      {userStancesSum < 1 ? (
        <div>
          <p>아직 참여한 사람이 없어요 😣 이 이슈에 제일 먼저 참여해 보세요!</p>
          <div>내 입장 남기기</div>
        </div>
      ) : isStanceTied ? (
        <p className={s.comment}>
          {sortedUserStances
            .filter((_e, i) => i <= isStanceTied)
            .map((stance, i) => {
              if (i < isStanceTied) {
                return (
                  <span key={stance.title}>
                    <span className={s.blueMain}>{stance.title}</span> 입장과{' '}
                  </span>
                );
              } else {
                return (
                  <span key={stance.title}>
                    <span className={s.blueMain}>{stance.title}</span> 입장이 각각{' '}
                  </span>
                );
              }
            })}
          <span className={s.blueMain}>
            {((sortedUserStances[0].count * 100) / userStancesSum).toFixed(0)}%
          </span>
          로 동률이에요!
        </p>
      ) : (
        <div className={s.comment}>
          <span className={s.blueMain}>{sortedUserStances[0].title}</span> 입장이 전체의{' '}
          <span className={s.blueMain}>
            {((sortedUserStances[0].count * 100) / userStancesSum).toFixed(0)}%
          </span>
          로 가장 많아요
        </div>
      )}
      {withStats && (
        <>
          <ul className={s.stanceItems}>
            {sortedUserStances.map(stance => (
              <li
                onClick={() => onStanceClick(stance.id)}
                className={s.stanceItem}
                key={stance.title}
              >
                <div
                  className={`${s.stanceItemBarChart} ${s[stance.fruit]}`}
                  style={{
                    width: `${((stance.count * 100) / userStancesSum).toFixed(0)}%`,
                  }}
                >
                  {}
                </div>
                <div className={s.stanceItemTitle}>{stance.title}</div>
                <div className={s.stanceItemPercentage}>
                  {stance.count > 0 ? ((stance.count * 100) / userStancesSum).toFixed(0) : 0}%
                </div>
              </li>
            ))}
          </ul>
          <div className={s.stanceCount}>{userStancesSum}명이 참여했어요</div>
        </>
      )}
    </div>
  );
};

export default CurrentStances;
