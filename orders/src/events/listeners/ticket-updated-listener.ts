import { Consumer, Kafka } from "kafkajs";
import { Listener } from "@nkticket/common";
import { TicketUpdatedEvent } from "@nkticket/common"; 
import { Subjects } from "@nkticket/common";
import { Ticket } from "../../model/ticket";

export class TicketCreatedListener extends Listener<TicketUpdatedEvent> {
  consumer: Consumer;
  topicName: Subjects.TicketUpdated = Subjects.TicketUpdated;
  groupName = 'orders-group';

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: TicketUpdatedEvent["data"], topic: string, partition: number) {
    console.log("Received TicketUpdatedEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);

    const ticket = await Ticket.findById(data.id);

    if(!ticket){
      throw new Error("Ticket not find while updating it in order service");
    }

    const {price , title} = data;

    ticket.set({price , title});
    
    await ticket.save();
  }

  validateMessage(data: any): data is TicketUpdatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.title === "string" &&
      typeof data.price === "number"
    );
  }
  
}
