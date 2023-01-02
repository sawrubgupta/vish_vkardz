"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_index_routes_1 = __importDefault(require("./api/api.index.routes"));
const cors_1 = __importDefault(require("cors"));
const rateLimiter_1 = require("./api/v1/middleware/rateLimiter");
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
function default_1(app) {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.urlencoded({ extended: false, limit: '1gb' }));
    app.set('view engine', 'hbs');
    app.use((0, morgan_1.default)('dev'));
    // app.use(morgan('common', {
    //     stream: fs.createWriteStream(__dirname+ '/access.log', {flags: 'a'})
    // }));
    app.use(express_1.default.static(__dirname + "./public_html"));
    app.use('/api', rateLimiter_1.rateLimiterUsingThirdParty, api_index_routes_1.default);
    app.use('*', (req, res) => {
        res.status(404).json({
            message: 'Resource not available'
        });
    });
    app.use((err, req, res, next) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: err
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            message: "Unexpected Error Occurred. Please contact our support team."
        });
    });
}
exports.default = default_1;
;
