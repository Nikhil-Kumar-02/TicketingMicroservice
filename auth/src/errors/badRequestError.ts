import { CustomError } from "./customError";

export class BadRequestError extends CustomError{
  statusCode = 400;
  reason = "";

  constructor(message:string){
    super(message);

    this.reason = message;

    Object.setPrototypeOf(this,BadRequestError.prototype);

  }


  serializeErrors(){
    return [
      {message : this.reason}
    ]
  }
  
}