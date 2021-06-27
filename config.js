// config 는 도메인 사고 난 후에 생성 QA 동안은 https://repol.vercel.app 으로 한다.
const config = {
  host: process.env.API_HOSTNAME,
};

const config_dev = {
  host: process.env.API_HOSTNAME,
};

if (process.env.NODE_ENV === 'production') {
  module.exports = config;
} else {
  module.exports = config_dev;
}
