import { Request, Response } from "express";
import {
  resData,
  resError,
  hashMe,
  filterPasswordOut,
} from "../../helpers/tools";
import * as validate from "validate.js";
import Validator from "../../helpers/validation.helper";
import { User } from "../../src/entity/User";
import * as jwt from "jsonwebtoken";
import PhoneFormat from "../../helpers/phone.helper";
import { Category } from "../../src/entity/Category";
import { Product } from "../../src/entity/Product";
import { Method } from "../../src/entity/Method";

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
    } catch (err) {
      return resError(res, "user not found");
    }

    if (user) return resError(res, `Phone ${req.body.phone} already exists`);
    //hash the password
    let password = await hashMe(req.body.password);
    //create otp
    let otp = Math.floor(1000 + Math.random() * 9000);
    var token = jwt.sign(
      { name: req.body.name, phone: req.body.phone, otp },
      "shhhhh"
    );

    user = await User.create({
      name: req.body.name,
      phone: phoneObj.globalP,
      password,
      active: true,
      complete: false,
      otp,
      token,
    });

    await user.save();

    return resData(res, filterPasswordOut(user));
  }

  ///---------------------Login----------------------------------------//

  static async login(req: Request, res: Response): Promise<object> {
    //validate
    let invalid = validate(req.body, Validator.login());
    if (invalid) return resError(res, invalid);

    //check in database by phone number and token
    try {
      let findOne = await User.findOne({
        where: {
          phone: req.body.phone,
          token: req.headers.token,
        },
      });
      //if user && if user.completed = true
      if (findOne) {
        if (findOne.complete) return resData(res, "logged in");
        return resError(res, "Registeration is not completed yet (otp)");
      }
      return resError(res, "User is not registered");
    } catch (err) {
      return resError(res, "error occured");
    }
  }

  ///---------------------otp----------------------//

  static async otp(req: Request, res: Response): Promise<object> {
    //validate the otp code looks
    let invalid = validate(req.body, Validator.otp());
    if (invalid) return resError(res, invalid);

    //check for token
    let token = req.headers.token;
    jwt.verify(token, "shhhhh", async (err, decoded) => {
      //check the token
      if (err) resError(res, "invalid token");

      //check the otp
      try {
        if (decoded.otp == req.body.otp) {
          //update the user
          try {
            let user = await User.findOne({ where: { phone: decoded.phone } });
            user.complete = true;
            await user.save();
            //send something to tell them its done
            return resData(res, "Registeration completed");
          } catch (err) {
            return resError(res, "user not found");
          }
        }
        return resError(res, `The code ${req.body.otp} is incorrect`);
      } catch (err) {
        console.log(err);
      }
    });
  }

  ///---------------------get all categories----------------------//

  static async categories(req: Request, res: Response): Promise<object> {
    try {
      let categories = await Category.find({ where: { active: true } });
      return resData(res, { categories });
    } catch (err) {
      return resError(res, "categories not found");
    }
  }

  ///---------------------get category products by id----------------------//
  static async products(req: Request, res: Response): Promise<object> {
    try {
      let categoryProducts = await Product.find({
        where: { category: req.params.id, active: true },
      });
      return resData(res, categoryProducts);
    } catch (err) {
      resError(res, "error occured");
    }
  }
  ///---------------------get methods----------------------//
  static async methods(req: Request, res: Response): Promise<object> {
    try {
      let methods = await Method.find();
      return resData(res, methods);
    } catch (err) {
      resError(res, "error occured");
    }
  }
}
