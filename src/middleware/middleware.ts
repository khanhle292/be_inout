import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Mysql from "./../connections/mysql/index";

const privateKey: string =
  "235243e4280497f7438ab491b7cce6ec2be780885b15f5b743de837bcc077dcc";

export const decodeLoginJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, privateKey);
    return decoded;
  } catch (error) {
    console.log("[ERROR][MIDDLEWARE] decodeLoginJWT:", error);
    return null;
  }
};

export const encodeLoginJWT = (data: any) => {
  try {
    const token = jwt.sign({ ...data }, privateKey, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    return token;
  } catch (error) {
    console.log("[ERROR][MIDDLEWARE] encodeLoginJWT:", error);
    return null;
  }
};

export const verifyLoginToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];
    const verify: any = decodeLoginJWT(token);
    if (verify) {
      const { id } = verify;
      if (id) {
        new Mysql()
          .queryWithCondition({
            field: "id",
            operator: "=",
            value: id,
            table: "Merchants",
          })
          .then((value) => {
            if (Array.isArray(value) && value.length > 0) {
              const temp = value[0];
              if (token === temp.token) {
                req.body.jwtTokenData = verify;
                next();
              } else {
                res.status(401).send({
                  status: false,
                  message: "You are not authorized to make this request",
                });
              }
            }
          })
          .catch((error) => {
            res.status(401).send({
              status: false,
              message: "You are not authorized to make this request",
            });
          });
      }
    } else {
      res.status(401).send({
        status: false,
        message: "You are not authorized to make this request",
      });
    }
  } else {
    res.status(401).send({
      status: false,
      message: "You are not authorized to make this request",
    });
  }
};
