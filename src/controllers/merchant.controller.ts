import type { Request, Response } from "express";
import Merchant from "./../models/Merchants";
import { encodeLoginJWT } from "./../middleware/middleware";

class MerchantController {
  index(req: Request, res: Response) {
    const { jwtTokenData } = req.body;

    if (jwtTokenData) {
      const data = {
        name: jwtTokenData?.merchantName,
        address: jwtTokenData?.merchantAddress,
        config: jwtTokenData?.merchantConfig,
      };

      res.json({
        status: true,
        message: "merchant detail!",
        result: data,
      });
    } else {
      res.json({
        status: false,
        message: "merchant detail!",
        result: null,
      });
    }
  }

  login(req: Request, res: Response) {
    const { username, password } = req.body;
    const service = new Merchant();

    service
      .login(username, password)
      .then((value) => {
        const result: any = {
          status: true,
          message: "success",
          result: null,
        };
        if (value && Object.keys(value)?.length > 0) {
          const token = encodeLoginJWT(value);
          result.result = token;
        }
        res.json(result);
      })
      .catch((error) => {
        const result: any = {
          status: false,
          message: error?.message,
          result: null,
        };

        res.status(400).json(result);
      });
  }
}

export default new MerchantController();
