import { CustomError } from "./customError";

export class NotFoundError extends CustomError{
  statusCode = 404;

  constructor(){
    super("Method not implemented.");

    Object.setPrototypeOf(this , NotFoundError.prototype);
  } 
  
  serializeErrors(){
    return [
      {
        message : "Route Does Not Exists"
      }
    ]
  }
  

}