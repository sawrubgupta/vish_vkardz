import axios from 'axios';

export const getQr =async (username:string) => {
    let result:any = null;
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
