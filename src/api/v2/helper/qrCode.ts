import axios from 'axios';
import QRCode from 'qrcode';
import * as utility from "./utility";
import config from "../config/development";

export const getQr = async (username: string) => {
    let result: any = null;
    try {
        const response = await axios({
            url: `https://vkardz.com/api/qrCode.php?username=${username}`,
            method: "get",
        });
        result = response.data;
        return result;
    } catch (error) {
        result = false;
        return result;
    }
}

// ====================================================================================================
// ====================================================================================================

export const generateQr = async (key: string) => {
    try {
        const result = await QRCode.toDataURL(config.vkardUrl+key);
        const imgUrl = await utility.base64ImgUpload("qrcode", `${result}`, key);
        
        return imgUrl;

    } catch (err) {
        console.error(err)
        return false;
    }

}

// ====================================================================================================
// ====================================================================================================
