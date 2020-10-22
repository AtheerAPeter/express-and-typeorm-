require("dotenv").config();

let config: any;
export default config = {
  jwtSecret: process.env.JWT_SECRET || "shhh",
  zcSecret: process.env.ZC_SECRET || "shhh",
  zcMerchant: process.env.ZC_MERCHANT || "shhh",
  zcMsid: process.env.ZC_MSID || "shhh",
};
