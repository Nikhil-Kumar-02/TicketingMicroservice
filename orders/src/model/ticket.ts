import mongoose, { mongo, Mongoose } from "mongoose";
import { OrderStatus } from "@nkticket/common";

//an interface that describes  the properties that are required to create a new order
interface TicketAttrs{
  title: string;
  price: Number;
}

//an interface that describes the properties that a order document has 
export interface TicketDoc extends mongoose.Document{
  title: string;
  price: Number;
}

//an interface that describes the property that the order model has
interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs:TicketAttrs):TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title : {
      type : String,
      required : true,
    },
    price : {
      type : Number,
      required : true,
      min : 0
    },
  },
  {
    toJSON: {
      transform(doc,ret){
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

ticketSchema.statics.build = (arrts:TicketAttrs) => {
  return new Ticket(arrts);
}
//above alone would have suffice if we were to use js we dont have to write this
//interface UserModel extends mongoose.Model<any>{
//   build(attrs:userAttrs):any;
// }

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket' , ticketSchema);


export { Ticket };