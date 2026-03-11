'use strict';

const bcrypt = require('bcrypt');

/**
 * A set of functions called "actions" for `me`
 */

module.exports = {
  read: async (ctx) => {
    const { params, state: { user }, request: { query } } = ctx;

    // Buscar o registro do usuário com as relações necessárias
    const register = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { id: user.id },
      populate: [
        'avatar', 
        'specialty', 
        'sub_specialties',
        'address',
        'professionalData',
        'skills',
        'certificate_license',
        'publications',
        'members',
        'links',
        'academic_education',
        'academic_education.university',
        'blocks',
        'others' // Adicionando a relação com o campo "others"
      ],
    });

    // Garantir que o CRM seja retornado
    register.crm = register.professionalData?.crm || null;
    register.crm_state = register.professionalData?.state_crm || null;

    // NÃO REMOVER NENHUMA OUTRA LÓGICA!

    return register;
  },

  readFriend: async (ctx) => {
    const { query } = ctx;

    // ID específico do usuário que será o "Admin Invisível"
    const invisibleAdminId = '36'; // ID do usuário específico para o admin invisível

    // Verificar se o usuário logado é o Admin Invisível
    const isInvisibleAdmin = ctx.state.user?.id === invisibleAdminId;

    // Buscar o registro de outro usuário (amigo)
    const filters = isInvisibleAdmin ? { id: query.user } : {
      id: query.user,
      role: {
        name: {
          $ne: 'Admin Invisível'
        }
      }
    };

    const register = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: filters,
      populate: [
        'avatar', 
        'specialty', 
        'sub_specialties',
        'address',
        'professionalData',
        'skills',
        'certificate_license',
        'publications',
        'members',
        'links',
        'academic_education',
        'academic_education.university',
        'others' // Adicionando a relação com o campo "others"
      ],
    });

    // Garantir que o CRM seja retornado
    register.crm = register.professionalData?.crm || null;
    register.crm_state = register.professionalData?.state_crm || null;

    // NÃO REMOVER NENHUMA OUTRA LÓGICA!

    return register;
  },

  update: async (ctx) => {
    const { state: { user }, request: { body } } = ctx;

    // Log para depuração
    console.log("PRETEND SAVE", body);

    // ADICIONAR O CAMPO isOngoing, SEM MUDAR NADA MAIS
    if (body.academic_education) {
      body.academic_education = body.academic_education.map(education => {
        if (education.isOngoing) {
          // Se o curso está em andamento, o campo 'end' pode ser null
          education.end = null;
        }
        return education;
      });
    }

    // Atualizar o registro do usuário com os dados do corpo da requisição
    const register = await strapi.entityService.update("plugin::users-permissions.user", user?.id, {
      data: body,
    });

    // NÃO REMOVER O CAMPO PASSWORD OU QUALQUER OUTRA COISA!

    return register;
  },

  updatePassword: async (ctx) => {
    const { state: { user }, request: { body } } = ctx;

    // Verificar se a senha foi enviada
    if (!body.password) {
      return ctx.badRequest("A senha é obrigatória.", { code: "BadRequest", status: "400" });
    }

    // Hash da nova senha
    const password = bcrypt.hashSync(body.password, 10);

    // Atualizar o registro do usuário com a nova senha
    const register = await strapi.db.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: { 
        password: password, 
        id: user.id 
      }
    });

    // NÃO REMOVER O CAMPO PASSWORD!

    return register;
  },

  remove: async (ctx) => {
    const { state: { user } } = ctx;

    // Deletar o registro do usuário
    const register = await strapi.db.query("plugin::users-permissions.user").delete({
      where: { id: user.id }
    });

    return register;
  },
};
