import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import worker from "./routes/Worker";
import merchant from "./routes/Merchant";

const app = express();
app.use(bodyParser.raw());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/worker", worker);
app.use("/api/merchant", merchant);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
