import type { Request, Response } from "express";
import VehicleTypes from "./../models/VehicleTypes";

class VehicleTypeController {
  index(req: Request, res: Response) {
    new VehicleTypes().migrate();
    res.send("Request1");
  }

  store(req: Request, res: Response) {
    res.json("hello 2");
  }

  update(req: Request, res: Response) {
    res.send("hello 3");
  }
}

export default new VehicleTypeController();
