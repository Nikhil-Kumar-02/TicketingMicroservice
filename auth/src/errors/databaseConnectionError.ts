import { CustomError } from "./customError";

interface CustomErrorStructure{
  statusCode:number;
  serializeErrors():{
    message:string;
    feild?:string;
    type?:string;
  }[];
}

/**
 * remainder on abstract class
 * cannot be instanctiated
 * used to setup requirements for the sub class
 * do create a class when translated to js, which means we can use instance of checks!!
 * but the interface fades away when converted to js
 * the problem with interface is ki we have to check for every chlid ones instance
 * as the parent inteface doesnot exits in js thats why using abstract class
 */


export class DatabaseConnectionError extends CustomError{
  statusCode = 500;
  reason = "Error connecting to database";

  constructor(){
    super("Error connecting to db");
    //above message will not be sent to the end user rather they are only for logging purposes

    Object.setPrototypeOf(this , DatabaseConnectionError.prototype);
  }

  serializeErrors(){
    return [
      {message : this.reason}
    ];
  }
}