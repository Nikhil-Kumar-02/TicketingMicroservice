import request from 'supertest';
import { app } from "../../app";

it("return 201 on sucessful signup " , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail.com",
      password : "password"
    })
    .expect(201);
})

it("return 400 giving invalid email " , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail",
      password : "password"
    })
    .expect(400);
})

it("return 400 giving invalid email with proper message" , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail",
      password : "password"
    })
    .expect(400 , { errors : [ { message: 'Not a valid e-mail address', field: 'email' } ] });
})

it("return 400 on giving invalid password " , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail.com",
      password : "q"
    })
    .expect(400);
})

it("return 400 on giving invalid password with message" , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail.com",
      password : "q"
    })
    .expect(400 , { errors : [ { message: 'Password must be of length between 4 and 10', field: 'password' } ] });
})

it("return 400 on not passing on the email " , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      password : "password"
    })
    .expect(400);
})

it("return 400 on not passing on the password " , async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail.com",
    })
    .expect(400);
})

it("return jwt token in cookie to set in the browser " , async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email : "test@gmail.com",
      password : "password"
    })
    expect(console.log(response));
  // Check if the response has the 'Set-Cookie' header
  expect(response.headers['set-cookie']).toBeDefined();

  // Optionally, you can check if the JWT token is present in the cookie
  const cookie = response.headers['set-cookie'][0];
  expect(cookie).toContain('session=');
})