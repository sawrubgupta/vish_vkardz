"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
const dbV2_1 = __importDefault(require("./dbV2"));
const port = process.env.PORT || 5000;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false, limit: '1gb' }));
(0, app_1.default)(app);
db_1.default;
dbV2_1.default;
app.listen(port, () => {
    console.log(`Express server listening on ${port} `);
});
exports.default = app;
