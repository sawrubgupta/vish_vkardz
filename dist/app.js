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
    // app.use(express.static(__dirname+"./uploads"))
    app.use('/api', rateLimiter_1.rateLimiterUsingThirdParty, api_index_routes_1.default);
    var destinationPath = "";
    var dbImagePath = "";
    // SET STORAGE
    /*
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if(req.body.type === "profile"){
                    destinationPath="../public_html/uploads/profile/thumb/";
                    dbImagePath="uploads/profile/thumb/";
                } else if(req.body.type === "cover_photo"){
                    destinationPath="../public_html/uploads/profile/cover/";
                    dbImagePath="uploads/profile/cover/";
                } else if(req.body.type === "custom_logo"){
                    destinationPath="../public_html/uploads/custom-logo/";
                    dbImagePath="uploads/custom-logo/";
                }else{
                    destinationPath="../public_html/uploads/";
                    dbImagePath="uploads/";
                }
                cb(null, destinationPath)
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                dbImagePath = dbImagePath+''+uniqueSuffix+'_' +  file.originalname;
                cb(null,uniqueSuffix+'_' +  file.originalname)
            }
        })
        var upload = multer({ storage: storage })
    
    //   app.post('/api/v1/vkardz/uploadFile', upload.single('file'),authenticatingToken, function (req, res) {
    //     const file = req.file
    //     const userId: string = res.locals.jwt.userId;
    
    //   if (!file) {
    //     return res.status(400).json({
    //       status: false,
    //       message: "Please upload a file.",
    //     });
    //   }
      
    //   var sql : string ="";
    //   if(req.body.type === "profile"){
    //     sql = `UPDATE users SET thumb = '${dbImagePath}' WHERE id = ${userId}`;
    //   } else if(req.body.type === "cover_photo"){
    //     sql = `UPDATE users SET cover_photo = '${dbImagePath}' WHERE id = ${userId}`;
    //   }
      
    
    //   pool.query(sql, async (err: any, socialRow: any) => {
      
    //     if (err) {
    //       return res.status(400).json({
    //         status: false,
    //         message: "Something went wrong",
    //       });
    //     }
    
    //     return res.status(200).json({
    //       status: true,
    //       message: "Image uploaded Successfully",
    //     });
    //   })
    //  });
    */
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
