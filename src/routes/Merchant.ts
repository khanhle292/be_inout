import Merchant from "./../controllers/merchant.controller";
import Item from "./../controllers/item.controller";
import express from "express";
import { verifyLoginToken } from "./../middleware/middleware";

let router = express.Router();
router.post("/login", Merchant.login as any);
router.post("/register", Merchant.register as any);
router.use(verifyLoginToken);

router.route("/").get(Merchant.index as any);
router.route("/vehicles").get(Item.index as any);
router.route("/checkin").post(Merchant.checkIn as any);
router.route("/checkout").post(Merchant.checkOut as any);
router.route("/transaction").get(Merchant.getTransaction as any);
//   .post(Merchant.store as any);

export default router;
