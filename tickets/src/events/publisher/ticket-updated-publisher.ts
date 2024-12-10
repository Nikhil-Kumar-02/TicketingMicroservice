import { Publisher , Subjects , TicketUpdatedEvent } from "@nkticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  topicName : Subjects.TicketUpdated =  Subjects.TicketUpdated;
  
}