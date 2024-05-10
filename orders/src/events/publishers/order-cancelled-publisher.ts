import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@microservice-training/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
