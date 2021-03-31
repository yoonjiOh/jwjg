module.exports = {
  async rewrites() {
    return [
      {
        source: '/issues',
        destination: '/',
      },
      {
        source: '/issues/:issue_id/opinions',
        destination: '/opinions',
      },
      {
        source: '/issues/:issue_id/opinions/:opinion_id',
        destination: '/opinions/[id]',
      },
      {
        source: '/issues/:issue_id/opinions/new',
        destination: '/opinions/new',
      },
      {
        source: '/admin',
        destination: '/admin/issues',
      },
    ];
  },
};
