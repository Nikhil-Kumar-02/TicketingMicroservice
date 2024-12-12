import request from "supertest";
import { app } from "../../app";

it("checks if there exists a route of /api/orders" , async () => {
  const response = await request(app).post("/api/orders");
  // console.log("the response in new order test is : " , response);
})

it("can only be acessed if the user is signed in" , async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});