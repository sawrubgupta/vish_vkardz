"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmSend = void 0;
const lodash_1 = __importDefault(require("lodash"));
const firebase_config_1 = __importDefault(require("../../v1/config/firebase-config"));
const fcmSend = (notification, registrationTokens, extraData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!extraData) {
        extraData = null;
    }
    let returnData = null;
    try {
        registrationTokens = lodash_1.default.uniq(registrationTokens);
        if (registrationTokens.length === 0) {
            console.log("Empty token");
            return;
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
        };
        const messaging = firebase_config_1.default.messaging();
        yield messaging.sendMulticast(message)
            .then((response) => {
            if (response.failureCount > 0) {
                const failedTokens = [];
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(registrationTokens[idx]);
                    }
                });
                console.log('List of tokens that caused failures: ' + failedTokens);
                returnData = failedTokens;
                return failedTokens;
            }
            returnData = response;
        }).catch(e => {
            console.log(e);
        });
    }
    catch (e) {
        returnData = false;
        console.log(e);
    }
    return returnData;
});
exports.fcmSend = fcmSend;
// ====================================================================================================
// ====================================================================================================
