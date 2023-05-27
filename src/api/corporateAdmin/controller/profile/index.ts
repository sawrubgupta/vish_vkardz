import {Router} from "express";

import * as profileController from './profile';
import * as exportController from './exportUser';

import * as validation from '../../middleware/validation';
import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

import multer from "multer";
var destinationPath : string = "";
var dbImagePath : string = "";

export var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let type = req.body.type;
        if(type === "add_client"){
            destinationPath="./public_html/uploads/";
            dbImagePath="public_html/uploads/";
        }else{
            destinationPath="./public_html/uploads/";
            dbImagePath="public_html/uploads/";
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

const profileRouter = Router();

profileRouter.get('/userList', authenticatingToken, profileController.userList);
profileRouter.patch('/updateUserDetail', tempAuthenticatingToken, validation.updateUserDetailValidation, profileController.updateUser);
profileRouter.patch('/updateUserDisplayField', tempAuthenticatingToken, validation.updateUserDisplayFieldValidation, profileController.updateUserDisplayField);
profileRouter.patch('/updateAdminDetail', authenticatingToken, validation.updateAdminDetailValidation, profileController.updateAdmin);
profileRouter.get('/adminProfile', authenticatingToken, profileController.adminProfile);

profileRouter.get('/exportUsers', authenticatingToken, exportController.exportUser);
profileRouter.get('/sampleImportFile', authenticatingToken, exportController.importSampleFile);
profileRouter.post('/importUsers', authenticatingToken, upload.single('file'), exportController.importUser);

export default profileRouter;
