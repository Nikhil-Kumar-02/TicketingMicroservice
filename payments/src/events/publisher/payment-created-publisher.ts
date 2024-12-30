import { PaymentCreatedEvent, Publisher, Subjects } from "@nkticket/common";

export class PaymentCreatedPublsiher extends Publisher<PaymentCreatedEvent>{
  topicName: Subjects.PaymentCreated = Subjects.PaymentCreated;
}