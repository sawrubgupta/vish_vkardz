import {Router} from "express";

import * as teamController from './team';

import * as validation from '../../middleware/validation';
import {authenticatingToken, tempAuthenticatingToken} from '../../middleware/authorization.controller';

const teamRouter = Router();

teamRouter.get('/permissionList', teamController.getPermissionList);
teamRouter.post('/addTeamMember', authenticatingToken, validation.teamMemberValidation, teamController.addTeamMember);
teamRouter.get('/teamMemberList', authenticatingToken, teamController.teamMemberList);
teamRouter.patch('/updateTeamMember', authenticatingToken, validation.updateTeamMemberValidation, teamController.updateTeamMember);
teamRouter.delete('/deleteTeamMember', authenticatingToken, teamController.deleteTeamMember);
teamRouter.get('/teamMemberDetail', authenticatingToken, teamController.teamMemberDetail);

export default teamRouter;
