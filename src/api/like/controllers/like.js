'use strict';

/**
 * like controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::like.like', ({ strapi }) => ({
  async toggleLike(ctx) {
    const { userId, postId } = ctx.request.body;

    if (!userId || !postId) {
      return ctx.badRequest('Parâmetros ausentes');
    }

    try {
      const existingLike = await strapi.db.query('api::like.like').findOne({
        where: { user: userId, post: postId },
      });

      if (existingLike) {
        await strapi.db.query('api::like.like').delete({
          where: { id: existingLike.id },
        });
        return { liked: false };
      } else {
        await strapi.db.query('api::like.like').create({
          data: { user: userId, post: postId },
        });
        return { liked: true };
      }
    } catch (error) {
      console.error('Erro ao alternar curtida:', error);
      return ctx.internalServerError('Erro interno');
    }
  },

  async getTotalLikes(ctx) {
    const { postId } = ctx.params;

    if (!postId) {
      return ctx.badRequest('Post ID ausente');
    }

    try {
      const totalLikes = await strapi.db.query('api::like.like').count({
        where: { post: postId },
      });

      return { totalLikes };
    } catch (error) {
      console.error('Erro ao obter total de curtidas:', error);
      return ctx.internalServerError('Erro interno');
    }
  },
}));
