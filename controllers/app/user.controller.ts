import { Request, Response } from "express";
import { resData, resError } from "../../helpers/tools";
import * as validate from "validate.js";
import Validator from "../../helpers/validation.helper";
import { User } from "../../src/entity/User";

export default class UserController {
  static async register(req: Request, res: Response): Promise<object> {
    let invalid = validate(req.body, Validator.register());
    if (invalid) return resError(res, invalid);

    let user: any;

    user = await User.findOne({ where: { phone: req.body.phone } });
    if (user) return resError(res, `Phone ${req.body.phone} already exists`);
    user = await User.create({
      ...req.body,
      active: true,
      complete: false,
      otp: 1111,
    });

    await user.save();

    return resData(res, { user });
  }
}
