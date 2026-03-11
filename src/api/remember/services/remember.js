'use strict';

/**
 * remember service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::remember.remember');
