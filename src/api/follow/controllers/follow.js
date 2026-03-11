'use strict';

/**
 * follow controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::follow.follow', ({ strapi }) => ({
    // Método para criar uma nova solicitação de conexão SEM DUPLICAÇÃO
    async create(ctx) {
        const { requester, requested } = ctx.request.body.data;

        // Verifica se já existe uma solicitação pendente ou aceita
        const existingFollow = await strapi.entityService.findMany('api::follow.follow', {
            filters: {
                $or: [
                    { requester, requested },
                    { requester: requested, requested: requester }
                ]
            }
        });

        if (existingFollow.length > 0) {
            return ctx.badRequest('Solicitação de conexão já existente.');
        }

        // Cria a solicitação de conexão com status "PENDENTE"
        const follow = await strapi.entityService.create('api::follow.follow', {
            data: { requester, requested, accepted: false, status: 'PENDENTE' },
        });

        // Cria uma notificação para o usuário solicitado
        await strapi.entityService.create('api::notification.notification', {
            data: {
                user: requested, // Usuário que receberá a notificação
                title: 'Nova solicitação de conexão',
                text: `Você recebeu uma solicitação de conexão de ${requester}`,
                processed: false,
            },
        });

        return follow;
    },

    // Método para aceitar ou recusar uma solicitação de conexão
    async update(ctx) {
        const { id } = ctx.params; // ID da solicitação
        const { accepted } = ctx.request.body.data;

        // Define o novo status com base na decisão do usuário
        const status = accepted ? 'ACEITO' : 'RECUSADO';

        // Atualiza a solicitação para aceitar ou rejeitar
        const follow = await strapi.entityService.update('api::follow.follow', id, {
            data: { accepted, status },
            populate: ['requester', 'requested'], // Garante que os relacionamentos sejam carregados
        });

        // Se a solicitação foi aceita
        if (accepted) {
            // Cria o registro espelhado caso ainda não exista
            const reverseFollowExists = await strapi.entityService.findMany('api::follow.follow', {
                filters: {
                    requester: follow.requested.id,
                    requested: follow.requester.id,
                },
            });

            if (reverseFollowExists.length === 0) {
                await strapi.entityService.create('api::follow.follow', {
                    data: {
                        requester: follow.requested.id,
                        requested: follow.requester.id,
                        accepted: true,
                        status: 'ACEITO',
                    },
                });
            }

            // Cria uma notificação para o solicitante
            await strapi.entityService.create('api::notification.notification', {
                data: {
                    user: follow.requester.id, // Solicitante da conexão
                    title: 'Solicitação de conexão aceita',
                    text: `${follow.requested.name} aceitou sua solicitação de conexão`,
                    processed: false,
                },
            });
        }

        return follow;
    },

    // Método para buscar o estado atual da solicitação
    async findOne(ctx) {
        const { id } = ctx.params;

        const follow = await strapi.entityService.findOne('api::follow.follow', { id });

        if (!follow) {
            return ctx.notFound('Solicitação de conexão não encontrada.');
        }

        return {
            id: follow.id,
            requester: follow.requester,
            requested: follow.requested,
            status: follow.status,
            accepted: follow.accepted
        };
    }
}));