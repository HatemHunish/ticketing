import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@microservice-training/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
