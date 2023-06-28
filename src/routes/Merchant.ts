import Merchant from "./../controllers/merchant.controller";
import express from "express";

let router = express.Router();

router.post("/login", Merchant.login as any);

router
  .route("/")
  .get(Merchant.index as any)
  .post(Merchant.store as any)
  .put(Merchant.update as any);

export default router;
