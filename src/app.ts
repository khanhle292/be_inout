import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";

import worker from "./routes/Worker";
import merchant from "./routes/Merchant";
import user from "./routes/User";

const app = express();
app.use(bodyParser.raw());

function shouldCompress(req: Request, res: Response) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
}

app.use(
  compression({
    // filter: Decide if the answer should be compressed or not,
    // depending on the 'shouldCompress' function above
    filter: shouldCompress,
  })
);

app.set("views", path.join(__dirname, "views"));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "jade");

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cookieParser());
app.use("/worker", worker);
app.use("/api/merchant", merchant);
app.use("/api/user", user);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
