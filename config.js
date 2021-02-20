// config 는 도메인 사고 난 후에 생성
const config = {};

const config_dev = {
  host: 'http://localhost:3000',
};

if (process.env.NODE_ENV === 'production') {
  mudule.exports = config;
} else {
  module.exports = config_dev;
}
