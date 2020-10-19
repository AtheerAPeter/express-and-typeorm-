import { Request, Response } from "express";
import { resData, resError } from "../../helpers/tools";
import { Category } from "../../src/entity/Category";
import { Invoice } from "../../src/entity/Invoice";
import { Method } from "../../src/entity/Method";
import { Product } from "../../src/entity/Product";

export default class HomeController {
  ///---------------------get all categories----------------------//

  static async categories(req: Request, res: Response): Promise<object> {
    try {
      let categories = await Category.find({
        where: { active: true },
        relations: ["products"],
      });
      return resData(res, { categories });
    } catch (err) {
      return resError(res, "categories not found");
    }
  }

  ///---------------------get category products by id----------------------//
  static async products(req: Request, res: Response): Promise<object> {
    try {
      let data = await Product.find({
        where: { category: req.params.id, active: true },
      });
      return resData(res, data);
    } catch (err) {
      resError(res, "error occured");
    }
  }
  ///---------------------get methods----------------------//
  static async methods(req, res): Promise<object> {
    try {
      let data = await Method.find({ where: { active: true } });
      return resData(res, data);
    } catch (err) {
      resError(res, "error occured");
    }
  }
  ///---------------------get methods----------------------//
  static async getInvoices(req, res): Promise<object> {
    let user = req.user;
    try {
      let data = await Invoice.find({
        where: { user },
        join: {
          alias: "invoice",
          leftJoinAndSelect: {
            user: "invoice.user",
            items: "invoice.invoiceItems",
            product: "items.product",
          },
        },
      });
      return resData(res, data);
    } catch (err) {
      resError(res, { err });
    }
  }
}
