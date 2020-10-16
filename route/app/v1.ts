// router
import * as express from "express";
import UserController from "../../controllers/app/user.controller";
const router = express.Router();

// create v1
//// register
router.post("/register", UserController.register);
//// login

//// catigories
//// category products
//// check out
//// invoices
//// methods
//// notifications

export default router;
