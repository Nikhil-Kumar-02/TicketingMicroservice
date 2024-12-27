import { Consumer, Kafka } from "kafkajs";
import { Listener, OrderStatus } from "@nkticket/common";
import { ExpirationCompleteEvent } from "@nkticket/common"; 
import { Subjects } from "@nkticket/common";
import { Order } from "../../model/orders";
import { OrderCancelledPublsiher } from "../publishers/order-cancelled-publisher";
import { KafkaManager } from "../../kafkaManager";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  consumer: Consumer;
  topicName: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  groupName = 'order-service-expiration-complete-group';

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: ExpirationCompleteEvent["data"], topic: string, partition: number) {
    console.log("Received ExpirationCompleteEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);

    const order = await Order.findById(data.orderId).populate("ticket");

    if(!order){
      throw new Error("Expired order Not found");
    }

    order.set({status : OrderStatus.Cancelled});

    await order.save();
    
    await new OrderCancelledPublsiher(KafkaManager.getProducer()).publishMessage({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });
    
  }

  validateMessage(data: any): data is ExpirationCompleteEvent["data"] {
    return (
      typeof data.orderId === "string"
    );
  }
  
}
