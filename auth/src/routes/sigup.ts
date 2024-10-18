import express,{Request,Response} from "express";
import { body } from 'express-validator';
import { User } from "../models/user";
import { BadRequestError , validateRequest } from "@nkticket/common";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/api/users/signup" , 
 [
    body('email')
    .isEmail()
    .withMessage('Not a valid e-mail address') 
    , 
    body('password')
    .trim()
    .isLength({min:4 , max:10})
    .withMessage('Password must be of length between 4 and 10')
  ],
  validateRequest,
  async (req:Request,res:Response) => {

    
    const {email , password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      console.log("Email is already registered with us ");
      throw new BadRequestError("This email is already registered");
    }

    const user = User.build({email , password});
    await user.save();

    if(!process.env.JWT_KEY){
      throw new Error("Unable to find JWT_KEY");
    }

    //generate jsonwebtoken and 
    const userJwt = jwt.sign({
      id: user._id,
      email: user.email,
    } , process.env.JWT_KEY);

    //store it on session object
    req.session = {
      jwt : userJwt
    };

    return res.status(201).send(user);
  }
)

export { router as signUpRoute };