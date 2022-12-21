import axios from 'axios';

export const getQr =async (username:string) => {
      const response = await axios({
        url: `https://vkardz.com/api/qrCode.php?username=${username}`,
        method: "get",
      });
  
      return response.data;
      
  }
  
// ====================================================================================================
// ====================================================================================================
