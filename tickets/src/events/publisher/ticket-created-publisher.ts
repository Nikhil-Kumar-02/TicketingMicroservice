import { Publisher , Subjects , TicketCreatedEvent } from "@nkticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  topicName : Subjects.TicketCreated =  Subjects.TicketCreated;
  
}