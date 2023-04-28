import {Router} from "express";

// import * as userController from './adminController';

import * as validation from '../../middleware/validation';
import {authenticatingToken} from '../../middleware/authorization.controller';

const profileRouter = Router();

// authRouter.post('/register', validation.adminRegistrationValidation, userController.register);

export default profileRouter;
