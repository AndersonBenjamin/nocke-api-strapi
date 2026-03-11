'use strict';

/**
 * specialty controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::specialty.specialty', ({ strapi }) => ({
  async create(ctx) {
    const { name } = ctx.request.body.data;

    if (!name) {
      return ctx.badRequest('O campo "name" é obrigatório.');
    }

    // Verifica se a especialidade já existe
    const existingSpecialty = await strapi.db.query('api::specialty.specialty').findOne({
      where: { name },
    });

    if (existingSpecialty) {
      return ctx.conflict('A especialidade já existe.');
    }

    // Cria a nova especialidade
    const specialty = await strapi.entityService.create('api::specialty.specialty', {
      data: { name },
    });

    return ctx.created(specialty);
  },
}));
