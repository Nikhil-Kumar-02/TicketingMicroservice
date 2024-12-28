import { Listener , OrderCancelledEvent, Subjects } from "@nkticket/common";
import { Consumer, Kafka } from "kafkajs";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { KafkaManager } from "../../kafkaManager";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
  topicName: Subjects.OrderCancelled = Subjects.OrderCancelled;
  groupName = "ticket-service-order-cancelled";
  consumer: Consumer;

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: OrderCancelledEvent["data"], topic: string, partition: number) {
    console.log("Received OrderCancelledEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);

    const { id:orderId , ticket:{id:ticketId}} = data;
    
    //find the ticket that the order is reserving
    const ticket = await Ticket.findById(ticketId);

    //if no then throw an error
    if(!ticket){
      throw new Error("ticket not found in ticket service order created listener")
    }

    //mark the ticket as being reserved by setting the order id property
    ticket.set({orderId:undefined})

    //save the ticket
    await ticket.save();    

    await new TicketUpdatedPublisher(KafkaManager.getProducer()).publishMessage({
      id : ticket.id , 
      title : ticket.title,
      price : ticket.price,
      userId : ticket.userId,
      version : ticket.version,
      orderId : ticket.orderId
    })
  }

  validateMessage(data: any): data is OrderCancelledEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.version === "number" &&
      typeof data.ticket.id === "string"
    );
  }

}