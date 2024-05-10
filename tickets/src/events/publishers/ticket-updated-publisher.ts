import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@microservice-training/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
