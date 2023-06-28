import type { Request, Response } from "express";
import Vehicles from "./../models/Vehicles";

class VehicleController {
  update(req: Request, res: Response) {
    const { id, data } = req.body;
    new Vehicles().update(id, data).then((value) => {
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
