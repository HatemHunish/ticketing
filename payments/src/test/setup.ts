import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";
declare global {
  var signin: (id?:string) => string[];
  var generateRandomEamil: (random?: boolean) => string;
}
jest.mock("../nats-wrapper.ts");

const generateRandomEamil = (random?: boolean) => {
  return random
    ? `${Math.floor(Math.random() * Date.now()).toString(36)}@test.com`
    : "test@test.com";
};

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = (id?:string) => {
  const payload = {
    id:id|| new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };

  const sessionJson = JSON.stringify(session);

  const base64 = Buffer.from(sessionJson).toString("base64");

  return [`session=${base64}`];
};

global.generateRandomEamil = generateRandomEamil;
