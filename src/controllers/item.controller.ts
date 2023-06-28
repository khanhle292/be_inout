import type { Request, Response } from "express";
import Items from "./../models/Items";

class ItemController {
  index(req: Request, res: Response) {
    const { jwtTokenData } = req.body;
    if (jwtTokenData) {
      const { merchantId } = jwtTokenData;
      new Items().getAll(merchantId).then((value) => {
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

  checkIn(req: Request, res: Response) {
    const {
      jwtTokenData,
      token,
      entryTime = Date.now(),
      status = "CHECKED_IN",
    } = req.body;
    if (jwtTokenData) {
      const { merchantId } = jwtTokenData;
      new Items()
        .store({ merchantId, agentId: token, entryTime, status })
        .then((value) => {
          const payload = {
            status: true,
            message: "Get Items",
            data: value,
          };
          if (!value) {
            payload.status = false;
          }

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
