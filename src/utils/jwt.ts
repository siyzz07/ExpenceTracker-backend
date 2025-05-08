import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface User {
  _id: string;
  isActive?:Boolean 
}

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
// const JWT_EXPIRES_IN =process.env.JWT_EXPIRES_IN;
const JWT_EXPIRES_IN = "10d";
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in the environment variables");
}

export const generateToken = (user: User): string => {
  return jwt.sign({ _id: user._id, isActive:user.isActive}, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
