import express,{Request,Response} from "express";
import { body , validationResult} from 'express-validator';
import { RequestValidationError } from "../errors/requestValidationError";
import { User } from "../models/user";
import { BadRequestError } from "../errors/badRequestError";
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
  ] 
  , 
  async (req:Request,res:Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      //return res.status(400).send(errors.array());
      // throw new Error("Email and Password are Required");

      console.log("error is " , errors.array());

      throw new RequestValidationError(errors.array());
    }
    
    const {email , password } = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      console.log("Email is already registered with us  ;");
      throw new BadRequestError("This email is already registered");
    }

    const user = User.build({email , password});
    await user.save();

    //generate jsonwebtoken and 
    const userJwt = jwt.sign({
      id: user._id,
      email: user.email,
    } , "abcd");

    //store it on session object
    req.session = {
      jwt : userJwt
    };

    return res.status(201).send(user);
  }
)

export { router as signUpRoute };