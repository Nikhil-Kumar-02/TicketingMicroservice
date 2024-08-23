import express,{Request,Response} from "express";
import { body , validationResult} from 'express-validator';

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
  (req:Request,res:Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
      //return res.status(400).send(errors.array());
      throw new Error("Email and Password are Required");
    }
    
    const {email , password } = req.body;

    console.log("creating a user");
    //for now let say our database is always down
    throw new Error("Cannot reach the Database");

    return res.status(200).json({
      message : "user has been sucessfully created",
      data : req.body,
    });

  }
)

export { router as signUpRoute };