import type { Request, Response } from "express";
import Merchant from "./../models/Merchants";
import { encodeLoginJWT } from "./../middleware/middleware";
import Vehicles from "../models/Vehicles";
import Items from "./../models/Items";
import Images from "./../models/Images";
import Mysql from "./../connections/mysql";

class MerchantController {
  index(req: Request, res: Response) {
    const { jwtTokenData } = req.body;

    if (jwtTokenData) {
      const data = {
        merchantName: jwtTokenData?.merchantName,
        merchantAddress: jwtTokenData?.merchantAddress,
        merchantConfig: jwtTokenData?.merchantConfig,
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
      .then(async (value) => {
        const result: any = {
          status: true,
          message: "success",
          result: null,
        };
        if (value && Object.keys(value)?.length > 0) {
          const token = encodeLoginJWT(value);
          const reson = await new Mysql().updateRecordById(
            value.id,
            { token },
            "Merchants"
          );
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

  async checkIn(req: Request, res: Response) {
    try {
      const {
        jwtTokenData,
        licensePlate,
        vehiclePriceId,
        entryTime,
        url,
        secretKey,
      } = req.body;

      console.log("jwtTokenData", jwtTokenData);
      const vehicle: any = await new Vehicles().store(
        {
          id: 0,
          licensePlate,
          vehiclePriceId,
        },
        true
      );

      if (vehicle) {
        const { id } = vehicle;
        if (id) {
          const item: any = await new Items().store(
            {
              id: 0,
              merchantId: jwtTokenData?.id,
              entryTime,
              secretKey,
              exitTime: 0,
              status: "CHECKED_IN",
              componentId: id,
              componentType: "Vehicles",
            },
            true
          );

          if (item) {
            const payloadImages = {
              url,
              componentId: item?.id,
              componentType: "Items",
              createdDate: Date.now(),
            };
            if (!Array.isArray(url)) {
              payloadImages.url = [url];
            }
            const value = await new Images().store(payloadImages);
            res.send({
              status: true,
              message: "checkin",
              data: value,
            });
            return;
          }
        }
      }
      res.send({ status: false, message: "checkin false", data: null });
    } catch (error: any) {
      console.log("[ERROR][CHECK_IN]", error?.message);
      res.send({
        status: false,
        message: "checkin false",
        data: error?.message,
      });
    }
  }
}

export default new MerchantController();
