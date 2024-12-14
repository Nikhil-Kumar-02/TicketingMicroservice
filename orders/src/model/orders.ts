import mongoose, { mongo, Mongoose } from "mongoose";
import { OrderStatus } from "@nkticket/common";
import { TicketDoc } from "./ticket";

//an interface that describes  the properties that are required to create a new order
interface OrderAttrs{
  userId: string;
  status: OrderStatus;
  expiresAt : Date;
  ticket : TicketDoc;
}

//an interface that describes the properties that a order document has 
interface OrderDoc extends mongoose.Document{
  userId: string;
  status: OrderStatus;
  expiresAt : Date;
  ticket : TicketDoc;
}

//an interface that describes the property that the order model has
interface OrderModel extends mongoose.Model<OrderDoc>{
  build(attrs:OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId : {
      type : String,
      required : true,
    },
    status : {
      type : String,
      required : true,
      enum : Object.values(OrderStatus),
      default : OrderStatus.Created
    },
    expiresAt : {
      type : mongoose.Schema.Types.Date,
    },
    ticket : {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

orderSchema.statics.build = (arrts:OrderAttrs) => {
  return new Order(arrts);
}
//above alone would have suffice if we were to use js we dont have to write this
//interface UserModel extends mongoose.Model<any>{
//   build(attrs:userAttrs):any;
// }

const Order = mongoose.model<OrderDoc,OrderModel>('Order' , orderSchema);


export { Order };