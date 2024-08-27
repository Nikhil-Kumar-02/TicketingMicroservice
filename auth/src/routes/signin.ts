import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { BadRequestError } from "../errors/badRequestError";
import { Password } from "../services/password";
const router = express.Router();
import jwt from 'jsonwebtoken';

router.post("/api/users/signin" , 
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid Email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cant be empty")
  ],
  validateRequest,
  async (req:Request,res:Response) => {

    const {email , password } = req.body;

    //check if the user exists 
    const foundUser = await User.findOne({email});

    if(!foundUser){
      //if user not exits then error
      throw new BadRequestError("email not registered");
    }

    //compare the passwords
    const passwordMatch = await Password.compare(foundUser.password , password);
    if(!passwordMatch){
      //wrong password
      throw new BadRequestError("Enter correct Password");
    }

    //use is valid send  a jwt token to mark him as signed
    if(!process.env.JWT_KEY){
      throw new Error("Unable to find JWT_KEY");
    }

    //generate jsonwebtoken and 
    const userJwt = jwt.sign({
      id: foundUser._id,
      email: foundUser.email,
    } , process.env.JWT_KEY);

    //store it on session object
    req.session = {
      jwt : userJwt
    };
    res.status(200).send("Signed In Sucessfully");
  }
)

export { router as signInRoute };