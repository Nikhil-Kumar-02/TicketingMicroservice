import { OrderCancelledEvent, Publisher, Subjects } from "@nkticket/common";

export class OrderCancelledPublsiher extends Publisher<OrderCancelledEvent>{
  topicName: Subjects.OrderCancelled = Subjects.OrderCancelled;
}