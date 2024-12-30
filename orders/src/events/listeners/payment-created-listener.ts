import { Consumer, Kafka } from "kafkajs";
import { Listener, OrderStatus } from "@nkticket/common";
import { PaymentCreatedEvent } from "@nkticket/common"; 
import { Subjects } from "@nkticket/common";
import { Order } from "../../model/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  consumer: Consumer;
  topicName: Subjects.PaymentCreated = Subjects.PaymentCreated;
  groupName = 'order-service-payment-complete-group';

  constructor(kafka: Kafka) {
    super();
    this.consumer = kafka.consumer({ groupId: this.groupName });
  }

  async logReceivedData(data: PaymentCreatedEvent["data"], topic: string, partition: number) {
    console.log("Received PaymentCreatedEvent:");
    console.log("Data:", data);
    console.log("Topic:", topic);
    console.log("Partition:", partition);

    const order = await Order.findById(data.orderId);

    if(!order){
      throw new Error("Order on which payment i made not found");
    }

    order.set({status : OrderStatus.Complete});

    await order.save();

    //ideally after we are done saving the order we should emit an event of order updated in order
    //to match up with the version but since for a order this is the last step of their lifecycle
    //so even if we are skipping it this wont have a bad toll on our consistency     
  }

  validateMessage(data: any): data is PaymentCreatedEvent["data"] {
    return (
      typeof data.id === "string" &&
      typeof data.orderId === "string" &&
      typeof data.stripeId === "string"
    );
  }
  
}
