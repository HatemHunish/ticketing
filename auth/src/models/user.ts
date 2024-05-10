import mongoose from "mongoose";
import { PasswordEncrypt } from "../services/password";

interface IUser {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordEncrypt.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

const User = mongoose.model<IUser>("User", userSchema);

export { User };
