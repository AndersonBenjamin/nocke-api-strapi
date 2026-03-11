'use strict';

/**
 * remember router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::remember.remember');
