import "reflect-metadata";
import * as express from "express";
import v1 from "../route/app/v1";
import { createConnection } from "typeorm";
import { Category } from "./entity/Category";
import { Product } from "./entity/Product";

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

    app.listen(port, () => console.log(`Running on port: ${port}`));
  })
  .catch((err) => console.log(err));
