import {Router} from "express";
import * as validation from '../../middleware/validation';

import * as followsController from '../../controller/followers/follow';
import {authenticatingToken} from '../../middleware/authorization.controller';

const followerRouter = Router();

followerRouter.post("/follow", authenticatingToken, followsController.followed);
followerRouter.post("/unfollow", authenticatingToken, followsController.unfollow);
followerRouter.get("/getFollowers", authenticatingToken, followsController.getFollowers);
followerRouter.get("/getFollowings", authenticatingToken, followsController.getFollowings);

export default followerRouter;

