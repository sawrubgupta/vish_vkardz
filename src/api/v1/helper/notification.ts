import _ from 'lodash';
import admin from '../../v1/config/firebase-config';

export const fcmSend = async(notification:any, registrationTokens:any, extraData:any) => {
    if(!extraData){
      extraData = null 
    }   
    let returnData = null;
    try {
        registrationTokens = _.uniq(registrationTokens);
        
        if(registrationTokens.length === 0) {
            console.log("Empty token");
            return
        } 
        let message = {
            notification: notification,
            "android": {
                "notification": {
                    "sound": "default"
                }
            },
            "apns": {
                "payload": {
                    "aps": {
                        "sound": "default"
                    }
                }
            },
            tokens: registrationTokens,
            data: notification,
            "webpush": {
                "headers": {
                    "Urgency": "high"
                }
            }
        }
        const messaging =  admin.messaging();
        await messaging.sendMulticast(message)
        .then((response) => {
            
            if (response.failureCount > 0) {
                const failedTokens:any = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(registrationTokens[idx])
                    }
                });
                console.log('List of tokens that caused failures: ' + failedTokens)
                returnData = failedTokens
                return failedTokens
            }
            returnData = response;
        }).catch(e =>{
            console.log(e);
        });
    } catch (e) {
        returnData = false;
        console.log(e);
    }
    return returnData;  
}

// ====================================================================================================
// ====================================================================================================
