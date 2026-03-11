'use strict';

/**
 * sharing service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sharing.sharing');
