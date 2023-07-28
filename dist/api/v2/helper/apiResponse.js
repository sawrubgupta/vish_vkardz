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
Object.defineProperty(exports, "__esModule", { value: true });
exports.somethingWentWrongMessage = exports.errorMessage = exports.validationErrorWithData = exports.successResponse = void 0;
const successResponse = (res, msg, data) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: true,
        data: data,
        message: msg,
    };
    return res.status(200).json(resData);
});
exports.successResponse = successResponse;
// ====================================================================================================
// ====================================================================================================
const validationErrorWithData = (res, msg, data) => __awaiter(void 0, void 0, void 0, function* () {
    var resData = {
        status: false,
        message: msg,
        data: data
    };
    return res.status(400).json(resData);
});
exports.validationErrorWithData = validationErrorWithData;
// ====================================================================================================
// ====================================================================================================
const errorMessage = (res, statusCode, msg) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(statusCode).json({
        status: false,
        data: null,
        message: msg
    });
});
exports.errorMessage = errorMessage;
// ====================================================================================================
// ====================================================================================================
const somethingWentWrongMessage = (res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(400).json({
        status: false,
        data: null,
        message: "Something went wrong"
    });
});
exports.somethingWentWrongMessage = somethingWentWrongMessage;
// ====================================================================================================
// ====================================================================================================
