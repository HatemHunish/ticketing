import mongoose, { version } from "mongoose";
import { Order } from "./order";
import { OrderStatus } from "@microservice-training/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id:string
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event:{id:string,version:number}):Promise<TicketDoc|null>
}
const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

TicketSchema.set("versionKey", "version");
TicketSchema.plugin(updateIfCurrentPlugin);

// TicketSchema.pre("save", function (done) {
// this.$where={
//    version:this.get("version")-1
// }
// done();
// })

TicketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version-1,
  });

};
TicketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    ...attrs,_id:attrs.id
  });
};

TicketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Create,
        OrderStatus.Complete,
        OrderStatus.AwaitingPayment,
      ],
    },
  });
  return !!existingOrder;
};
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", TicketSchema);
export { Ticket };
