import type { Request, Response } from "express";
import Items from "./../models/Items";

class ItemController {
  index(req: Request, res: Response) {
    const { jwtTokenData } = req.body;
    if (jwtTokenData) {
      const { id } = jwtTokenData;
      new Items().getAllDetail(id).then((value) => {
        const payload = {
          status: true,
          message: "Get Items",
          data: value,
        };
        res.send(payload);
      });
    } else {
      res.status(400).send({
        status: false,
        message: "Not found Merchant information",
        data: null,
      });
    }
  }
}

export default new ItemController();
