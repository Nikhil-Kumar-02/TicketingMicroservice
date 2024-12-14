import mongoose, { mongo, Mongoose } from "mongoose";
import { Order , OrderStatus } from "./orders";

//an interface that describes  the properties that are required to create a new order
interface TicketAttrs{
  title: string;
  price: Number;
}

//an interface that describes the properties that a order document has 
export interface TicketDoc extends mongoose.Document{
  title: string;
  price: Number;
  isReserved() : Promise<boolean>
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

//schema.statics.method_name is the way of adding method to a model
ticketSchema.statics.build = (arrts:TicketAttrs) => {
  return new Ticket(arrts);
}

//schema.methods.method_name is the way of adding method to a model
ticketSchema.methods.isReserved = async function() {
  //this === the ticket document that we just called "isReserved on"

  //run a query to look at look at all orders. find an order where the ticket is the ticket we just 
  //found and the order status in *not* cancelled .
  //if we found the order then it means the ticket *is* reserved.
  const existingOrder = await Order.findOne({
    ticket : this,
    status : {
      $in : [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ]
    }
  })

  if(existingOrder){
    return true;
  }
  return false;

}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket' , ticketSchema);


export { Ticket };