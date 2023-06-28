import VehicleTypeController from "./../controllers/vehicle.controller";
import express from "express";

let router = express.Router();

router
  .route("/")
  .get(VehicleTypeController.index as any)
  .post(VehicleTypeController.store as any)
  .put(VehicleTypeController.update as any);

export default router;
