import pool from '../../../../dbV2';
import * as utility from "../../helper/utility";
import config from '../../config/development';

export const coinCron = async () => {
    try {
        const createdAt = utility.dateWithFormat()
        const currentDate:any = utility.getTimeAndDate();
        const date = currentDate[0];

        const sql = `SELECT * FROM user_coins WHERE expired_at = '${date}' AND coin_status = '${config.activeStatus}'`;
        const [rows]:any = await pool.query(sql);
        if (rows.length > 0) {
            // const updateSql = `UPDATE user_coins SET coin_status = ?, updated_at = ? WHERE expired_at = ?`;
            // const VALUES = [config.expiredStatus, createdAt, date];
            // const [updatedRows]:any = await pool.query(updateSql, VALUES);

            for await (const ele of rows) {
                const expiredCoin = ele.coin - ele.used_coin_amount;

                const updateSql = `INSERT INTO user_coins(user_id, type, coin, used_coin_amount, coin_status, created_at, expired_at) VALUES(?, ?, ?, ?, ?, ?, ?)`;
                const VALUES = [ele.user_id, config.expiredStatus, ele.coin, ele.used_coin_amount, config.expiredStatus, createdAt, date];    
                const [updatedRows]:any = await pool.query(updateSql, VALUES);

                if (updatedRows.affectedRows > 0) {
                    const updateUserSql = `UPDATE users SET offer_coin = offer_coin - ${expiredCoin} WHERE id = ${ele.user_id}`;
                    const [userRows]:any = await pool.query(updateUserSql);
    
                    console.log("Status Change Successfully");
                } else {
                    console.log("Failed to change status");
                }
            }
        } else {
            console.log("Eempty Rows");
        }
    } catch (error) {
        console.log(error);
    }
}

// ====================================================================================================
// ====================================================================================================
