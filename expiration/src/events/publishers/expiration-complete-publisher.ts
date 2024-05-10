import { Publisher ,ExpirationCompleteEvent, Subjects} from "@microservice-training/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}  