module.exports = {
  routes: [
      {
          "method": "GET",
          "path": "/v1/notifications",
          "handler": "notifier.notifications",
          "config": {
              "policies": [],
              "prefix": "",
              "description": "Read user notifications"
          }
      },       
      {
          "method": "POST",
          "path": "/v1/notifications/token",
          "handler": "notifier.saveDeviceToken",
          "config": {
              "policies": [],
              "prefix": "",
              "description": "Save device token belongs user"
          }
      },          
      {
          "method": "PUT",
          "path": "/v1/notifications/:id",
          "handler": "notifier.updateNotification",
          "config": {
              "policies": [],
              "prefix": "",
              "description": "Update notification"
          }
      },          
      {
          "method": "DELETE",
          "path": "/v1/notifications/:id",
          "handler": "notifier.remove",
          "config": {
              "policies": [],
              "prefix": "",
              "description": "Remove one notification"
          }
      },
      {
          "method": "DELETE",
          "path": "/v1/notifications-all",
          "handler": "notifier.removeAll",
          "config": {
              "policies": [],
              "prefix": "",
              "description": "Remove all notifications"
          }
      }
  ],
};