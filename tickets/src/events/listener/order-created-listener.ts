import { Listener , OrderCreatedEvent, Subjects } from "@nkticket/common";
import { Consumer, Kafka } from "kafkajs";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";
import { KafkaManager } from "../../kafkaManager";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  topicName: Subjects.OrderCreated = Subjects.OrderCreated;
  groupName = "ticket-service-order-created";
  consumer: Consumer;

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: OrderCreatedEvent["data"], topic: string, partition: number) {
    console.log("Received OrderCreatedEvent:");
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
    ticket.set({orderId:orderId})

    //save the ticket
    await ticket.save();    

    await new TicketUpdatedPublisher(KafkaManager.getProducer()).publishMessage({
      id : ticket.id , 
      title : ticket.title,
      price : ticket.price,
      userId : ticket.userId,
      version : ticket.version,
      orderId
    })
  }

  validateMessage(data: any): data is OrderCreatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.status === "string" &&
      typeof data.userId === "string" &&
      typeof data.expiresAt === "string" &&
      typeof data.version === "number" &&
      data.ticket &&
      typeof data.ticket.id === "string" &&
      typeof data.ticket.price === "number"
    );
  }

}