import * as bcrypt from "bcrypt";
import * as twilio from "twilio";

const resError = (res, error, status = 400) => {
  let response = { status: false, error };
  res.statusCode = status;
  return res.json(response);
};

const resData = (res, data, status = 200) => {
  let response = { status: true, data };
  res.statusCode = status;
  return res.json(response);
};

const hashMe = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const filterPasswordOut = (user) => {
  const allowed = ["id", "name", "phone", "otp", "token"];

  const filtered = Object.keys(user)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: user[key],
      };
    }, {});

  return filtered;
};

export { resError, resData, hashMe, filterPasswordOut };
