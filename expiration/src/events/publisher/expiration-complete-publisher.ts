import { ExpirationCompleteEvent, Publisher, Subjects } from "@nkticket/common";

export class ExpirationCompletePublsiher extends Publisher<ExpirationCompleteEvent>{
  topicName: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}