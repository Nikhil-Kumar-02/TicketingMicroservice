import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo:MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "abcd";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});


beforeEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if(collections && collections.length>0){
    for(let collection of collections){
      await collection.deleteMany({}); 
    }
  }
});

afterAll(async() => {
  await mongo.stop();
  await mongoose.connection.close();
});

export const getCookieAfterSignIn = async () => {
  const email = "test@gmail.com"
  const password = "password"

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email , password
    })

  const cookie = response.get("Set-Cookie");

  return cookie;

}
