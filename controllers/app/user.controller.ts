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

export default class UserController {
  static async register(req: Request, res: Response): Promise<object> {
    let invalid = validate(req.body, Validator.register());
    if (invalid) return resError(res, invalid);
    //validate phone number
    let phoneObj = PhoneFormat.getAllFormats(req.body.phone);
    if (!phoneObj.isNumber)
      return resError(res, `Phone ${req.body.phone} is not valid`);

    let user: any;

    user = await User.findOne({ where: { phone: req.body.phone } });
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

  static async login(req: Request, res: Response): Promise<object> {
    //validate
    let invalid = validate(req.body, Validator.login());
    if (invalid) return resError(res, invalid);

    //check in database by phone number and token
    let findOne = await User.findOne({
      where: {
        phone: req.body.phone,
        token: req.headers.token,
      },
    });

    if (findOne) {
      return resData(res, "logged in");
    }

    return resError(res, "User is not registered");
  }

  static async otp(req: Request, res: Response): Promise<object> {
    //validate the otp code looks
    let invalid = validate(req.body, Validator.otp());
    if (invalid) return resError(res, invalid);

    //check for token
    let token = req.headers.token;
    jwt.verify(token, "shhhhh", (err, decoded) => {
      //check the token
      if (err) resError(res, "invalid token");

      //check the otp
      if (decoded.otp == req.body.otp) {
        //update the user

        return resData(res, "correct");
      }
      return resError(res, `The code ${req.body.otp} is incorrect`);
    });
  }
}
