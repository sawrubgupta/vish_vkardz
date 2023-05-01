import {Router} from "express";

import * as profileController from './profile';

import * as validation from '../../middleware/validation';
import {authenticatingToken} from '../../middleware/authorization.controller';

const profileRouter = Router();

profileRouter.get('/userList', authenticatingToken, profileController.userList);

export default profileRouter;
