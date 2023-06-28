import type { Request, Response } from "express";
import express from "express";
import ModelWorker from "./../models/ModelWorker";

let router = express.Router();

router.get("/", (req: Request, res: Response) => {
  new ModelWorker().sync();
  res.send("done");
});

export default router;
