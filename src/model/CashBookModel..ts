import mongoose,{Schema,Document} from "mongoose";
import { type } from "os";


interface IData{
    description:String;
    type:String
    controlId?:any;
    amount:Number
}


interface IcashBook{
    userId:mongoose.Schema.Types.ObjectId;
    data:IData[],
    
}

const CashBookSchema=new Schema<IcashBook>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    data:[{
        description:{
            type:String
        },
        amount:{
            type:Number
        },
        controlId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'ExpenseControl'
        },
        type:{
            type:String,
            enum:["Debit","Credit"]
        },
        date:{
            type:Date,
            default: Date.now
        }
    }]
})


const CashBook=mongoose.model<IcashBook>("CashBook",CashBookSchema)
export default CashBook