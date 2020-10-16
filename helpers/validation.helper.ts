export default class Validator {
  static register = (must = true) => ({
    name: {
      presence: must,
      type: "string",
    },
    phone: {
      presence: must,
      type: "string",
      length: { maximum: 15, minimum: 10 },
    },
    password: {
      presence: must,
      length: { maximum: 15, minimum: 4 },
    },
  });

  static login = (must = true) => ({
    phone: {
      presence: must,
      type: "string",
      length: { maximum: 15, minimum: 10 },
    },
    password: {
      presence: must,
      length: { maximum: 15, minimum: 4 },
    },
  });

  static otp = (must = true) => ({
    otp: {
      presence: must,
      type: "number",
    },
  });
}
