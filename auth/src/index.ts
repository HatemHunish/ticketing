import mongoose from "mongoose";
import { app } from "./app";
const PORT = 3000;

const start = async () => {
  console.log("Starting server ...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KET must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Successfully");
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log("Listening on PORT :", PORT);
  });
};

start();
