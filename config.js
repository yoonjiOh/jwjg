const config = {
  host: 'https://jwjg.kr',
};

const config_dev = {
  host: 'http://localhost:3000',
};

if (process.env.NODE_ENV === 'production') {
  module.exports = config;
} else {
  module.exports = config_dev;
}
