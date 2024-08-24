import { Request, Response , NextFunction } from "express";
import { RequestValidationError } from "../errors/requestValidationError";
import { DatabaseConnectionError } from "../errors/databaseConnectionError";

export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction) => {
  // console.log("something went wrong " , err);

  if (err instanceof RequestValidationError) {
    const formattedError = err.errors.map((entry) => {
      if ('path' in entry) {
        console.log("path " , entry.path);
        return {
          msg: entry.msg,
          field: entry.path, 
        };
      } else {
        return {
          msg: entry.msg,
          type: entry.type,
        };
      }
    });

    // console.log("got a request validation error", formattedError);
    return res.status(400).send({
      errors :formattedError
    });
  }

  if(err instanceof DatabaseConnectionError){
    // console.log("got a database connection error");
    return res.status(500).send({
      errors : [
        {
          message: err.reason
        }
      ],
    })
  }

  res.status(400).send({
    message : [{message : "Something went wrong !!! "}],
  })
}