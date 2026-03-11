module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/likes/toggle',
      handler: 'like.toggleLike',
      config: {
        auth: false, // Pode ser true dependendo do uso
      },
    },
    {
      method: 'GET',
      path: '/likes/total/:postId',
      handler: 'like.getTotalLikes',
      config: {
        auth: false, // Pode ser true dependendo do uso
      },
    },
  ],
};
