'use strict';

const axios = require('axios').default

const dispatchPush = async (expoPushToken, title, body, metaData) => {

    const message = {
        to: expoPushToken, 
        sound: 'default', 
        title, 
        body, 
        data: { ...metaData }
    }; 
      
    await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers:  {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        }
    });
}


const releaseNotification = async (notification) => {
    if(notification.user){
        const userDevicesToken = await strapi.entityService.findMany("api::devicetoken.devicetoken", {
            filters: {
                user: notification.user.id
            }
        });
        if( userDevicesToken?.length ){
            const promises = []
            userDevicesToken.map(userDevice => promises.push( dispatchPush(userDevice.token, notification.title, notification.text, {}) ));
            await Promise.all(promises)
        }
    }else{
        // Global assinger - Notificacoes sem usuário alvo, devem ser direcionadas para todos os usuários
        const allUser = await strapi.entityService.findMany("plugin::users-permissions.user", {})
        const promises = allUser.map((item, key) => strapi.entityService.create('api::notification.notification', { data: { ...notification, user: item.id } }) );
        const results = await Promise.all(promises)
        console.log(`Global notification registred to ${ results.length } devices`)
    }
    await strapi.entityService.update('api::notification.notification', notification.id,{ data:{ processed:true } });
}

module.exports = {
    releaseNotification
};
