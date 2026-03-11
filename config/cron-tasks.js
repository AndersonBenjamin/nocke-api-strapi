
const { releaseNotification } = require('./notifier/push')

const saveRememberNotification = async remember => {
    try {
        // Valida se tem os dados necessários
        if (!remember?.user?.id || !remember?.event?.name) {
            console.log('[CRON] saveRememberNotification > Lembrete inválido, pulando:', remember?.id);
            return null;
        }

        await strapi.entityService.create('api::notification.notification', { 
            data: {
                title: "Lembrete de evento",
                text: `Evento ${remember?.event?.name}, ${remember?.event?.data || ''}`,
                user: remember?.user?.id,
                processed: false
            }
        })
        
        await strapi.entityService.update('api::remember.remember', remember?.id, { 
            data: {
                sented: true
            }
        })
        
        console.log(`[CRON] saveRememberNotification > Notificação criada para lembrete ${remember?.id}`);
        return true;
    } catch (error) {
        console.error('[CRON] saveRememberNotification > Erro ao salvar notificação:', error.message);
        console.error('[CRON] saveRememberNotification > Remember data:', JSON.stringify(remember, null, 2));
        return null;
    }
}

module.exports = {
    
    "0 22 * * *": async ({ strapi }) => {  // Todo dia às 22h (10pm)
        try {
            console.log('[CRON] 22h > Iniciando verificação de lembretes...');
            
            const registers = await strapi.entityService.findMany('api::remember.remember', { 
                filters:{
                    $or:[
                        {
                            sented: {
                                $eq: false
                            }
                        },
                        {
                            sented: {
                                $eq: null
                            }
                        },
                    ]
                },
                populate:{
                    event: true,
                    user: true
                }
            });    

            console.log(`[CRON] 22h > Encontrados ${registers?.length || 0} lembretes pendentes`);

            if(registers?.length){ 

                const ts = {
                    "day": (((1000 * 60) * 60)*24),
                    "week": ((((1000 * 60) * 60)*24)*7),
                    "month": ((((1000 * 60) * 60)*24)*30),
                }
                
                const eventsToSchedule = registers?.filter(f => {
                    const dateEvent = new Date(f?.event?.begins_date)?.getTime()
                    return dateEvent >= (new Date().getTime() - ts[f?.before])
                })

                console.log(`[CRON] 22h > ${eventsToSchedule?.length || 0} lembretes para processar`);

                const promises = eventsToSchedule?.map(saveRememberNotification)
                const responses = await Promise.allSettled(promises)
                
                const successful = responses.filter(r => r.status === 'fulfilled' && r.value).length;
                console.log(`[CRON] 22h > Notificações criadas: ${successful}/${eventsToSchedule?.length}`);
            }
        } catch (error) {
            console.error('[CRON] 22h > Erro ao processar lembretes:', error.message);
            console.error(error.stack);
        }
    },
    
    "0 21 * * *": async ({ strapi }) => {  // Todo dia às 21h (9pm)
        try {
            console.log('[CRON] 21h > Iniciando processamento de notificações push...');
            
            const registers = await strapi.entityService.findMany('api::notification.notification', { 
                filters:{
                    $or:[
                        {
                            processed: {
                                $eq: false
                            }
                        },
                        {
                            processed: {
                                $eq: null
                            }
                        },
                    ]
                },
            });
            
            console.log(`[CRON] 21h > Encontradas ${registers?.length || 0} notificações para processar`);
            
            if(registers?.length) {
                const results = await Promise.allSettled(registers.map(releaseNotification));
                const successful = results.filter(r => r.status === 'fulfilled').length;
                console.log(`[CRON] 21h > Notificações processadas: ${successful}/${registers.length}`);
            }
        } catch (error) {
            console.error('[CRON] 21h > Erro ao processar notificações:', error.message);
            console.error(error.stack);
        }
    },
    
};