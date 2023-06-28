import Merchant from "./../controllers/merchant.controller";
import Item from "./../controllers/item.controller";
import express from "express";
import { verifyLoginToken } from "./../middleware/middleware";
import Vehicles from "./../controllers/vehicle.controller";

let router = express.Router();

router.route("/vehicles").put(Vehicles.update as any);

export default router;
