import { Request, Response , NextFunction } from "express";
import { RequestValidationError } from "../errors/requestValidationError";
import { DatabaseConnectionError } from "../errors/databaseConnectionError";

export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction) => {
  // console.log("something went wrong " , err);

  if (err instanceof RequestValidationError) {
    // console.log("got a request validation error", formattedError);
    return res.status(err.statusCode).send({
      errors :err.serializeErrors()
    });
  }

  if(err instanceof DatabaseConnectionError){
    // console.log("got a database connection error");
    return res.status(err.statusCode).send({
      errors :err.serializeErrors(),
    })
  }

  res.status(400).send({
    message : [{message : "Something went wrong !!! "}],
  })
}