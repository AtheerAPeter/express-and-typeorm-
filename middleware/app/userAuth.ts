import * as jwt from "jsonwebtoken";
import { resError } from "../../helpers/tools";
import config from "../../config/config";
import { User } from "../../src/entity/User";

let userAuth: any;
export default userAuth = async (req, res, next): Promise<object> => {
  const token = req.headers.token;
  //if no token
  if (!token) return resError(res, "Token is required");
  let payload: any;
  // decrypt the token
  try {
    payload = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return resError(res, "invalid token");
  }
  try {
    let user = await User.findOne({
      where: { id: payload.id, active: true, complete: true },
    });
    if (!user)
      return resError(res, "please complete the registeration process");
    req.user = user;
    return next();
  } catch (error) {
    return resError(res, error);
  }
};
