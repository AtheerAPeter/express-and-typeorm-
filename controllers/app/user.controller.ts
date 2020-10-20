import { Request, Response } from "express";
import {
  resData,
  resError,
  hashMe,
  comparePassword,
} from "../../helpers/tools";
import * as validate from "validate.js";
import Validator from "../../helpers/validation.helper";
import { User } from "../../src/entity/User";
import * as jwt from "jsonwebtoken";
import PhoneFormat from "../../helpers/phone.helper";
import config from "../../config/config";
import { Product } from "../../src/entity/Product";
import { Invoice } from "../../src/entity/Invoice";
import { InvoiceItem } from "../../src/entity/InvoiceItem";
export default class UserController {
  ///---------------------Register----------------------------------------//

  static async register(req: Request, res: Response): Promise<object> {
    let invalid = validate(req.body, Validator.register());
    if (invalid) return resError(res, invalid);
    //validate phone number
    let phoneObj = PhoneFormat.getAllFormats(req.body.phone);
    if (!phoneObj.isNumber)
      return resError(res, `Phone ${req.body.phone} is not valid`);

    let user: any;

    try {
      user = await User.findOne({ where: { phone: req.body.phone } });
      if (user)
        if (user.complete)
          return resError(res, `Phone ${req.body.phone} already exists`);
        else {
          const token = jwt.sign({ id: user.id }, config.jwtSecret);
          user.otp = Math.floor(1000 + Math.random() * 9000);
          await user.save();
          user.password = null;
          user.otp = null;
          return resData(res, { data: { user, token } });
        }
    } catch (err) {
      return resError(res, err);
    }

    //hash the password
    let password = await hashMe(req.body.password);
    //create otp
    let otp = Math.floor(1000 + Math.random() * 9000);

    user = await User.create({
      name: req.body.name,
      phone: phoneObj.globalP,
      password,
      active: true,
      complete: false,
      otp,
    });

    await user.save();
    user.password = null;
    user.otp = null;

    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    return resData(res, { user, token });
  }

  ///---------------------Login----------------------------------------//

  static async login(req: Request, res: Response): Promise<object> {
    //validate
    let invalid = validate(req.body, Validator.login());
    if (invalid) return resError(res, invalid);
    let phoneObj = PhoneFormat.getAllFormats(req.body.phone);
    if (!phoneObj.isNumber)
      return resError(res, `Phone ${req.body.phone} is not valid`);

    //check in database by phone number and token
    try {
      let user = await User.findOne({
        where: {
          phone: phoneObj.globalP,
        },
      });
      //if no user
      if (!user) return resError(res, "user not registered");
      //compare the password
      let validPassword = await comparePassword(
        req.body.password,
        user.password
      );
      //if password is wrong
      if (!validPassword) return resError(res, "data is incorrect");
      //if not wrong make a new token and send
      const token = jwt.sign({ id: user.id }, config.jwtSecret);
      return resData(res, token);
    } catch (err) {
      return resError(res, "error occured");
    }
  }

  ///---------------------otp----------------------//

  static async otp(req, res): Promise<object> {
    //validate the otp code looks
    let invalid = validate(req.body, Validator.otp());
    if (invalid) return resError(res, invalid);

    //get token from headers
    let token = req.headers.token;

    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
      //check the token
      if (err) resError(res, "invalid token");

      //get user from db
      try {
        let user = await User.findOne(decoded.id);

        if (!user) return resError(res, "User does not exist");
        //check if user complete = true
        if (user.complete) return resError(res, "User already complete");
        //IF OTP WRONG
        if (user.otp != req.body.otp) {
          user.otp = null;
          await user.save();
          return resError(res, `OTP ${req.body.otp} is incorrect`);
        }
        user.complete = true;
        await user.save();
        user.password = null;
        return resData(res, { user });
      } catch (err) {
        return resData(res, err);
      }
    });
  }

  //-------------------------make invoide--------------------------//
  static async makeInvoice(req, res): Promise<object> {
    //validation
    let invalid = validate(req.body, Validator.invoiceValidation());
    if (invalid) return resError(res, invalid);

    //get products and quantity if the format is not valid
    let ids = [];
    //check every single product in the array for validation
    for (let iterator of req.body.products) {
      let invalid = validate(iterator, Validator.oneProduct());
      if (invalid) return resError(res, invalid);
      ids.push(iterator.id);
    }

    //get the user
    let user = req.user;

    //get the products from db
    let products = await Product.findByIds(ids);

    //calculate the total

    let total = 0;
    for (let product of products) {
      total =
        total +
        product.price *
          req.body.products.filter((e) => (e.id = product.id))[0].quantity;
    }

    //make the invoice
    let invoice: any;
    invoice = await Invoice.create({
      ...req.body,
      total,
      status: "pending",
      user,
    });
    await invoice.save();

    //zc stuff

    //invoice items to connect products with the user

    for (const product of products) {
      let invoiceItem = await InvoiceItem.create({
        quantity: req.body.products.filter((e) => (e.id = product.id))[0]
          .quantity,
        invoice,
        subTotal:
          req.body.products.filter((e) => (e.id = product.id))[0].quantity *
          product.price,
        product,
      });
      await invoiceItem.save();
    }

    return resData(res, { invoice });
  }

  ///---------------------forgot password --------------------------//
  static async forgotPassword(req, res): Promise<object> {
    //validate
    let invalid = validate(req.body, Validator.forgotPassword());
    if (invalid) return resError(res, invalid);
    let phoneObj = PhoneFormat.getAllFormats(req.body.phone);
    if (!phoneObj.isNumber)
      return resError(res, `Phone ${req.body.phone} is not valid`);

    //get the phone number then check db for it if found then send otp
    try {
      let user: any;
      user = await User.findOne({ where: { phone: phoneObj.globalP } });
      //if user registered send otp and token to avoid making the user resend the number again, if not, user should register
      if (user.complete) {
        const token = jwt.sign({ id: user.id }, config.jwtSecret);
        let otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = otp;
        await user.save();
        return resData(res, { code: otp, token });
      }
    } catch (error) {
      return resError(res, "user is not registered");
    }
  }
  static async verifyForgot(req, res): Promise<object> {
    //validate
    let invalid = validate(req.body, Validator.forgotVerify());
    if (invalid) return resError(res, invalid);
    // get user from db
    let user = req.user;
    //if the code is incorrect
    if (user.otp != req.body.code) {
      user.otp = null;
      await user.save();
      return resError(
        res,
        `the code ${req.body.code} is incorrect go back to forgot password page`
      );
    }
    //if correct
    user.password = await hashMe(req.body.newPassword);
    await user.save();
    return resData(res, "The new password has been set, go to login page");
  }
}
