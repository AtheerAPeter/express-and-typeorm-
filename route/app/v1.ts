// router
import * as express from "express";
import UserController from "../../controllers/app/user.controller";
const router = express.Router();

// create v1
//// register
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/otp", UserController.otp);
router.get("/categories", UserController.categories);
router.get("/products/:id", UserController.products);
router.get("/methods", UserController.methods);

//// login

//// catigories
//// category products
//// check out
//// invoices
//// methods
//// notifications

export default router;
