import request from 'supertest';
import { app } from "../../app";
import { getCookieAfterSignIn } from '../../test/setup';


it("response with details about current user " , async () => {
  const cookie = await getCookieAfterSignIn()

  if(cookie){
    const response = await request(app)
                    .get("/api/users/currentUser")
                    .set("Cookie" , cookie)

    expect(response.body.currentUser.email).toEqual("test@gmail.com");
    }
})

it("response with null about current user " , async () => {
    const response = await request(app)
                    .get("/api/users/currentUser")

    expect(response.body.currentUser).toBeNull()
})