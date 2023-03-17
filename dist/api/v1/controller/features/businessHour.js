"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessHourList = exports.addBusinessHour = void 0;
const db_1 = __importDefault(require("../../../../db"));
const apiResponse = __importStar(require("../../helper/apiResponse"));
const utility = __importStar(require("../../helper/utility"));
const addBusinessHour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    try {
        const userId = res.locals.jwt.userId;
        const createdAt = utility.dateWithFormat();
        const deleteQuery = `DELETE FROM business_hours WHERE user_id = ${userId}`;
        const [data] = yield db_1.default.query(deleteQuery);
        let sql = `INSERT INTO business_hours(user_id, days, start_time, end_time, status, created_at) VALUES `;
        let result = "";
        try {
            for (var _d = true, _e = __asyncValues(req.body.businessHours), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const businessHourData = _c;
                    const days = businessHourData.days;
                    const startTime = businessHourData.startTime;
                    const endTime = businessHourData.endTime;
                    const status = businessHourData.status;
                    sql = sql + ` (${userId}, '${days}', '${startTime}', '${endTime}', '${status}', '${createdAt}'), `;
                    result = sql.substring(0, sql.lastIndexOf(','));
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const [rows] = yield db_1.default.query(result);
        if (rows.affectedRows > 0) {
            return yield apiResponse.successResponse(res, "Business Hours Added Successfully", null);
        }
        else {
            return yield apiResponse.errorMessage(res, 400, "Failed to insert, try again");
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.addBusinessHour = addBusinessHour;
// ====================================================================================================
// ====================================================================================================
const businessHourList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.jwt.userId;
        const sql = `SELECT * FROM business_hours WHERE user_id = ${userId}`;
        const [rows] = yield db_1.default.query(sql);
        if (rows.length > 0) {
            delete rows[0].user_id;
            return apiResponse.successResponse(res, "Data Retrieved Successfully", rows);
        }
        else {
            let data = [{
                    "id": null,
                    "days": 0,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 1,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 2,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 3,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 4,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 5,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                },
                {
                    "id": null,
                    "days": 6,
                    "start_time": "00.00",
                    "end_time": "00.00",
                    "status": 0,
                    "created_at": null
                }];
            return apiResponse.successResponse(res, "No data found", data);
        }
    }
    catch (error) {
        console.log(error);
        return apiResponse.errorMessage(res, 400, "Something went wrong");
    }
});
exports.businessHourList = businessHourList;
// ====================================================================================================
// ====================================================================================================
