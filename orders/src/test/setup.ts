import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
const crypto = require('crypto');

let mongo:MongoMemoryServer;

jest.mock("../kafkaManager.ts");

beforeAll(async () => {
  jest.clearAllMocks();
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

export const getCookieAfterSignIn = (id?:String) => {
  const email = "test@gmail.com"

  if(!id){
    const randomNumber = crypto.randomInt(100000000, 1000000000); 
    id = randomNumber.toString();
  }

  //build a jwt payload {id , email}
  const payload = {
    id : id,
    email
  }

  //create the jwt
  const token = jwt.sign(payload , process.env.JWT_KEY!);

  //build session object
  const session =   { jwt : token };

  //turn that session into json
  const sessionJSON = JSON.stringify(session);

  //take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  //return a string that a cookie with the encoded data
  return `session=${base64}`;
}
