import { app } from "../../app";
import request from 'supertest';

it("create account and logout and then signin with incorrect email format " , async () => {
  await request(app)
  .post("/api/users/signup")
  .send({
    email : "test@gmail.com",
    password : "1234"
  })
  .expect(201);

  //now try logging out
  const result = await request(app)
  .get("/api/users/signout")
  .expect(200 , {});

  await request(app)
          .post("/api/users/signin")
          .send({
            email : "test@gmail",
            password : "1234"
          })
          .expect(400 , { errors : [ { message : "Enter a valid Email" , field : "email"} ]});
})

it("create account and logout and then signin with incorrect password format " , async () => {
  await request(app)
  .post("/api/users/signup")
  .send({
    email : "test@gmail.com",
    password : "1234"
  })
  .expect(201);

  //now try logging out
  const result = await request(app)
  .get("/api/users/signout")
  .expect(200 , {});

  await request(app)
          .post("/api/users/signin")
          .send({
            email : "test@gmail.com",
            password : ""
          })
          .expect(400 , { errors : [ { message : "Password cant be empty" , field : "password"} ]});
})

it("create account and logout and then signin with random email id  " , async () => {
  await request(app)
  .post("/api/users/signup")
  .send({
    email : "test@gmail.com",
    password : "1234"
  })
  .expect(201);

  //now try logging out
  const result = await request(app)
  .get("/api/users/signout")
  .expect(200 , {});

  await request(app)
          .post("/api/users/signin")
          .send({
            email : "test1@gmail.com",
            password : "1234"
          })
          .expect(400 , { errors : [ { message : "email not registered" } ]});
})

it("create account and logout and then signin with incorrect password " , async () => {
  await request(app)
  .post("/api/users/signup")
  .send({
    email : "test@gmail.com",
    password : "1234"
  })
  .expect(201);

  //now try logging out
  const result = await request(app)
  .get("/api/users/signout")
  .expect(200 , {});

  await request(app)
          .post("/api/users/signin")
          .send({
            email : "test@gmail.com",
            password : "12345"
          })
          .expect(400 , { errors : [ { message : "Enter correct Password" } ]});
});

it("create account and logout and then signin with correct credentials"  , async () => {

  await request(app)
          .post("/api/users/signup")
          .send({
            email : "test@gmail.com",
            password : "1234"
          })
          .expect(201);

  //now try logging out
  const result = await request(app)
         .get("/api/users/signout")
         .expect(200 , {});

  expect(result.text).toBeDefined();


  await request(app)
          .post("/api/users/signin")
          .send({
            email : "test@gmail.com",
            password : "1234"
          })
          .expect(200 , "Signed In Sucessfully");

});