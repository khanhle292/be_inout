import type { Request, Response } from "express";
import Merchant from "./../models/Merchants";
import { encodeLoginJWT } from "./../middleware/middleware";
import Vehicles from "../models/Vehicles";
import Items from "./../models/Items";
import Images from "./../models/Images";
import Mysql from "./../connections/mysql";
import { getKeyAndDataFromConvertedData } from "./../utils/secrectKey";
import { calculator } from "./../utils/merchant";
import Transactions from "./../models/Transactions";
import Mysql from "./../connections/mysql/index";

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

  getTransaction(req: Request, res: Response) {
    const { jwtTokenData } = req.body;

    if (jwtTokenData) {
      new Transactions().get(jwtTokenData?.id).then((value) => {
        res.json({
          status: true,
          message: "merchant detail!",
          result: value,
        });
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
        if (typeof value === "string") {
          result.message = value;
          result.status = false;
          res.json(result);
          return;
        }
        if (
          value &&
          typeof value === "object" &&
          Object.keys(value)?.length > 0
        ) {
          const token = encodeLoginJWT(value);
          const reson = await new Mysql().updateRecordById(
            value?.id,
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

  register(req: Request, res: Response) {
    const service = new Merchant();

    service
      .register(req.body)
      .then(async (value) => {
        const result: any = {
          status: true,
          message: "success",
          result: value,
        };
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

      const count = await new Mysql().rawQuery(`SELECT COUNT(*) AS recordCount
      FROM Items
      WHERE secretKey = '${secretKey}';`);

      if (!count) {
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

  async checkOut(req: Request, res: Response) {
    try {
      const { jwtTokenData, secretKey, keyLength } = req.body;
      const test: any = await new Items().getAllByUser(secretKey);
      const resultFinal: { status: boolean; message: string; result: any } = {
        status: false,
        message: "",
        result: null,
      };
      const isCheckin = test[0];
      if (isCheckin) {
        const totalPay = calculator(isCheckin);
        const { prepaidAmount, extraAmount } = isCheckin;
        console.log("@@@@@", prepaidAmount + extraAmount);

        if (totalPay === prepaidAmount + extraAmount) {
          const crre = Date.now();
          await new Items().update(isCheckin?.id, {
            status: "CHECKED_OUT",
            exitTime: crre,
          });

          console.log("@@", isCheckin);

          resultFinal.status = true;
          resultFinal.message = "Success";
          res.send(resultFinal);
          await new Transactions().store({
            ...isCheckin,
            status: "CHECKED_OUT",
            exitTime: crre,
          });
          return;
        } else if (
          totalPay > prepaidAmount + extraAmount &&
          prepaidAmount > 0
        ) {
          resultFinal.status = false;
          resultFinal.message = "1002";
          res.send(resultFinal);
        } else {
          resultFinal.status = false;
          resultFinal.message = "1001";
          resultFinal.result = { totalAmount: totalPay };
          res.send(resultFinal);
        }
      } else {
        resultFinal.status = false;
        resultFinal.message = "1003";
        res.send(resultFinal);
      }
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
