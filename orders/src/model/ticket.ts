import mongoose, { version } from "mongoose";
import { Order , OrderStatus } from "./orders";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

//an interface that describes  the properties that are required to create a new order
interface TicketAttrs{
  id : string;
  title: string;
  price: number;
}

//an interface that describes the properties that a order document has 
export interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  version : number;
  isReserved() : Promise<boolean>
}

//an interface that describes the property that the order model has
interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs:TicketAttrs):TicketDoc;
  findbyEvent(event : {id:string , version : number}) : Promise<TicketDoc|null> ;
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

ticketSchema.set("versionKey" , "version");
// ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.pre("save" , function(done){

  this.$where = {
    version : this.get("version") - 1
  };

  done();
})

ticketSchema.statics.findbyEvent = (event : {id : string , version : number}) => {
  return Ticket.findOne({
    _id : event.id,
    version : event.version-1
  })
};

//schema.statics.method_name is the way of adding method to a model
ticketSchema.statics.build = (attrs:TicketAttrs) => {
  return new Ticket({
    _id : attrs.id,
    title : attrs.title,
    price :  attrs.price
  });
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