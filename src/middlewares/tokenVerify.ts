import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { log } from "console";

interface customRequest extends Request {
  user?: any;
}

const tokenVerify = (
  req: customRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // console.log("2");

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return void res.status(401).json({ message: "access denied" });
    }
    // console.log("jj");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    // console.log("3");

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "invalid token" });
  }
};

export default tokenVerify;
