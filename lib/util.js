import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const TIME_TRANSLATE_MAP = {
  'few seconds ago': '몇 초 전',
  'minute ago': '분 전',
  'minutes ago': '분 전',
  'hours ago': '시간 전',
  'days ago': '일 전',
  'a month ago': '한 달 전',
  months: '달 전',
  'a year': '일 년 전',
  years: '년 전',
};

export function getPubDate(date) {
  const tuned_date = dayjs(date).fromNow();

  let result;

  _.forIn(TIME_TRANSLATE_MAP, (val, key) => {
    if (tuned_date.includes(key)) {
      result = tuned_date.replace(key, TIME_TRANSLATE_MAP[key]);
      return result;
    }
    return;
  });

  return result;
}
