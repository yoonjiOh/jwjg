// config 는 도메인 사고 난 후에 생성 QA 동안은 https://repol.vercel.app 으로 한다.
const config = {
  host: 'https://repol.vercel.app:3000',
};

const config_dev = {
  host: 'http://localhost:3000',
};

if (process.env.NODE_ENV === 'production') {
  module.exports = config;
} else {
  module.exports = config_dev;
}
