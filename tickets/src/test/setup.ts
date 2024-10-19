import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

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

export const getCookieAfterSignIn = () => {
  const email = "test@gmail.com"

  //build a jwt payload {id , email}
  const payload = {
    id : "123456789",
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
