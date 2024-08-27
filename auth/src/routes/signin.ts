import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
const router = express.Router();

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
  (req:Request,res:Response) => {

    const {email , password } = req.body;

    res.send("signin route called");
  }
)

export { router as signInRoute };