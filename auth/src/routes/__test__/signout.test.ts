import request from 'supertest';
import { app } from '../../app';

it("returns empty data when i am logging off after signup"  , async () => {
  const response = await request(app)
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
});

//after signing up i am signing out
//now lets sign out after signing in

it("returns empty data when i am logging off after signin"  , async () => {

  const response = await request(app)
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


  const response1 = await request(app)
                          .post("/api/users/signin")
                          .send({
                            email : "test@gmail.com",
                            password : "1234"
                          })
                          .expect(200 , "Signed In Sucessfully");

  //now try logging out
  const result1 = await request(app)
         .get("/api/users/signout")
         .expect(200 , {});

  expect(result1.text).toBeDefined();
});

