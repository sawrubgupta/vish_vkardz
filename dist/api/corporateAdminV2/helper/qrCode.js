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
exports.getQr = void 0;
const axios_1 = __importDefault(require("axios"));
const getQr = (username) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    try {
        const response = yield (0, axios_1.default)({
            url: `https://vkardz.com/api/qrCode.php?username=${username}`,
            method: "get",
        });
        result = response.data;
        return result;
    }
    catch (error) {
        result = false;
        return result;
    }
});
exports.getQr = getQr;
// ====================================================================================================
// ====================================================================================================
// export const generateQr = async (key: string) => {
//     try {
//         const result = await QRCode.toDataURL(key);
//         const imgUrl = await utility.base64ImgUpload("qrcode", `${result}`, key);
//         console.log("img", imgUrl);
//         return imgUrl;
//     } catch (err) {
//         console.error(err)
//         return false;
//     }
// }
// ====================================================================================================
// ====================================================================================================
