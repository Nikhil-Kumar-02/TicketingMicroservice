import { OrderCreatedEvent, Publisher, Subjects } from "@nkticket/common";

export class OrderCreatedPublsiher extends Publisher<OrderCreatedEvent>{
  topicName: Subjects.OrderCreated = Subjects.OrderCreated;
}