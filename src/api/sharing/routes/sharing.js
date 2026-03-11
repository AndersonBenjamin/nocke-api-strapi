'use strict';

/**
 * sharing router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sharing.sharing');
