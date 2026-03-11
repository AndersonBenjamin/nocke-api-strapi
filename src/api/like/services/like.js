'use strict';

/**
 * like service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::like.like', ({ strapi }) => ({
  async getLikesByPost(postId) {
    return strapi.db.query('api::like.like').count({ where: { post: postId } });
  },
}));
