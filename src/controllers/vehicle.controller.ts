import type { Request, Response } from "express";
import Vehicles from "./../models/Vehicles";

class VehicleController {
  update(req: Request, res: Response) {
    new Vehicles().update(req.body).then((value) => {
      const payload = {
        status: true,
        message: "update",
        data: value,
      };
      res.send(payload);
    });
  }
}

export default new VehicleController();
