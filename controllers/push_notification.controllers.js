const { ONE_SIGNAL_CONFIG } = require("../config/notification_config");
const  pushNotificationService = require("../services/push_notification.services");

exports.SendNotification = (req, res, next) => {
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        contents: {"en": "Test Push Notification"},
        included_segments: ["ALL"],
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Custom Notification"
        },
    };

    
    

    pushNotificationService.SendNotification(message, (error, results) => {
        if (error){
            return next(error);

        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });
}

exports.SendNotificationToDevice = (req, res, next) => {
    var message = {
        app_id: ONE_SIGNAL_CONFIG.APP_ID,
        contents: {"en": "Test Push Notification"},
        included_segments: ["included_player_ids"],
        included_player_ids: req.body.devices,
        content_available: true,
        small_icon: "ic_notification_icon",
        data: {
            PushTitle: "Custom Notification"
        },
    };

    pushNotificationService.SendNotification(message, (error, results) => {
        if (error){
            return next(error);

        }
        return res.status(200).send({
            message: "Success",
            data: results,
        });
    });


    
}