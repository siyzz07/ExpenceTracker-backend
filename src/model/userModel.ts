import mongoose, { Document, Schema, Model } from "mongoose";

interface IUserRegister extends Document {
  name: string;
  email: string;
  password: string;
  // createdAt: Date;
  isActive: Boolean;
}

const userSchema = new mongoose.Schema<IUserRegister>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User: Model<IUserRegister> = mongoose.model<IUserRegister>(
  "User",
  userSchema
);

export default User;
