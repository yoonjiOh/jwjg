module.exports = {
  async rewrites() {
    return [
      {
        source: '/issues',
        destination: '/',
      },
      {
        source: '/issues/:issueId/opinions',
        destination: '/opinions',
      },
      {
        source: '/issues/:issueId/opinions/new',
        destination: '/opinions/new',
      },
      {
        source: '/issues/:issueId/opinions/:opinionId',
        destination: '/opinions/:opinionId',
      },
      {
        source: '/admin',
        destination: '/admin/issues',
      },
    ];
  },
};
