// router
import * as express from "express";
import UserController from "../../controllers/app/user.controller";
import HomeController from "../../controllers/app/home.controller";
import userAuth from "../../middleware/app/userAuth";
const router = express.Router();

//// user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/otp", UserController.otp);
router.post("/invoice", userAuth, UserController.makeInvoice);
router.post("/forgot", UserController.forgotPassword);
router.post("/forgotverify", userAuth, UserController.verifyForgot);

//home
router.get("/categories", HomeController.categories);
router.get("/products/:id", HomeController.products);
router.get("/methods", HomeController.methods);
router.get("/invoices", userAuth, HomeController.getInvoices);

export default router;
