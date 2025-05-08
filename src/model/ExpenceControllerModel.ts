import mongoose, { Schema, Document } from "mongoose";

// Interface for individual control
interface IControl {
  categoryName: string;
  description: string;
  endDate: Date;
  amount: number;
  status: boolean;
  TotalSpend:number;
  expenceHistory: {
    description: string;
    date: Date;
    amount: number;
  }[];
}

export interface IControlExpense extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  controles: IControl[];
}

const expenseControllerSchema = new Schema<IControlExpense>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  controles: [
    {
      categoryName: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      TotalSpend:{
        type:Number,
        default:0
      },
      status: {
        type: Boolean,
        default: true,
      },
      expenceHistory: [
        {
          description: {
            type: String,
            trim: true,
          },
          date: {
            type: Date,
          },
          amount: {
            type: Number,
            min: 0,
          },
        },
      ],
    },
  ],
});

const ExpenseControl = mongoose.model<IControlExpense>(
  "ExpenseControl",
  expenseControllerSchema
);

export default ExpenseControl;
