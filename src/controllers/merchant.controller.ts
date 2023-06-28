import type { Request, Response } from "express";
import Merchant from "./../models/Merchants";

class MerchantController {
  index(req: Request, res: Response) {
    res.send("Request1");
  }

  login(req: Request, res: Response) {
    const { username, password } = req.body;
    const service = new Merchant();
    service
      .login(username, password)
      .then((value) => {
        res.json(value);
      })
      .catch((error) => {
        res.status(400).json(error?.message);
      });
  }

  store(req: Request, res: Response) {
    res.json("hello 2");
  }

  update(req: Request, res: Response) {
    res.send("hello 3");
  }
}

export default new MerchantController();
