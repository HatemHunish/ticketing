import { PaymentCreatedEvent, Publisher, Subjects } from "@microservice-training/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated=Subjects.PaymentCreated;
}