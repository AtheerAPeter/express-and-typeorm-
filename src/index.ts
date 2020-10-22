import "reflect-metadata";
import * as express from "express";
import v1 from "../route/app/v1";
import { createConnection } from "typeorm";
import { Category } from "./entity/Category";
import { Product } from "./entity/Product";
import { resError } from "../helpers/tools";

createConnection()
  .then(async (connection) => {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(express.json());

    // create v1

    //// register
    app.use("/v1", v1);
    //// login
    //// catigories
    //// category products
    //// check out
    //// invoices
    //// methods
    //// notifications
    app.use((req, res, next) => {
      return resError(
        res,
        "this api contains: /register to register, /login to login, /otp to verify phone number, /invoice to make an invoice, /forgot and /forgotverify if password was forgotten, /catigories toget categories, /products/id to get a product by id, /methods get payment methods, /invoices to get the user's own invoices ",
        404
      );
    });
    app.listen(port, () => console.log(`Running on port: ${port}`));
  })
  .catch((err) => console.log(err));
