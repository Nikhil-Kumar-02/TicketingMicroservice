import { Request, Response , NextFunction } from "express";
import { CustomError } from "../errors/customError";
// import { RequestValidationError } from "../errors/requestValidationError";
// import { DatabaseConnectionError } from "../errors/databaseConnectionError";
//now our middleware wont get bloated with the very specific type of error objects

export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction) => {
  // console.log("something went wrong " , err);

  if (err instanceof CustomError) {
    // console.log("got a request validation error", formattedError);
    return res.status(err.statusCode).send({
      errors :err.serializeErrors()
    });
  }

  // if(err instanceof DatabaseConnectionError){
  //   // console.log("got a database connection error");
  //   return res.status(err.statusCode).send({
  //     errors :err.serializeErrors(),
  //   })
  // }

  return res.status(400).send({
    message : [{message : "Something went wrong !!! "}],
  })
}