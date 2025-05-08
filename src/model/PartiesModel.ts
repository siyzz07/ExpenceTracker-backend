import mongoose, { Schema, Document } from "mongoose";


interface ITransaction {
  toGet: number;
  toGave: number;
  reason?: string;
  date?: Date;
}


interface IParty {
  _id?: mongoose.Types.ObjectId
  name: string;
  description: string;
  phone: number;
  transactions: ITransaction[];
}


export interface IParties extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  parties: IParty[];
}

// Define the Schema
const partiesSchema = new Schema<IParties>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parties: [
    {
      name: {
         type: String,
          required: true
         },
      description: { 
        type: String,
         required: true 
        },
      phone: {
         type: Number, 
         required: true
         },
      transactions: [
        {
          toGet: { type: Number, default: 0 },
          toGave: { type: Number, default: 0 },
          reason: { type: String },
          date: { type: Date, default: Date.now },
        },
      ],
    },
  ],
});


const PartiesModel = mongoose.model<IParties>("Parties", partiesSchema);
export default PartiesModel;
