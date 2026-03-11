
const { releaseNotification } = require('./notifier/push')

const saveRememberNotification = async remember => {
    await strapi.entityService.create('api::notification.notification', { 
        data: {
            title: "Lembrete de evento",
            text: `Evento ${ remember?.event?.name }, ${ remember?.event?.data }`,
            user: remember?.user?.id,
            processed: false
        }
    })
    await strapi.entityService.update('api::remember.remember', remember?.id, { 
        data: {
            sented:true
        }
    })
}

module.exports = {
    
    "* * * * *": async ({ strapi }) => {
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

            const promises = eventsToSchedule?.map(saveRememberNotification)
            const responses = await Promise.all(promises)

            console.log("Promises scheduled", responses?.length)
        }
    },
    
    "*/15 * * * *": async ({ strapi }) => {
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
        if(registers?.length){ registers.map(releaseNotification) ;}
    },
    
};