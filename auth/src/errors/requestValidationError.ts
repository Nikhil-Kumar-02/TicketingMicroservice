import { ValidationError } from 'express-validator';
import { CustomError } from './customError';

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



export class RequestValidationError extends CustomError{
  errors: ValidationError[];
  statusCode = 400;

  constructor(errors: ValidationError[]){
    super("Invalid request Parameter");
    //above message will not be sent to the end user rather they are only for logging purposes
    this.errors = errors;

    //only because we are extending the built in class
    Object.setPrototypeOf(this , RequestValidationError.prototype);
  }

  serializeErrors(){
    const formattedError = this.errors.map((entry) => {
      if ('path' in entry) {
        // console.log("path " , entry.path);
        return {
          message: entry.msg,
          field: entry.path, 
        };
      } else {
        return {
          message: entry.msg,
          type: entry.type,
        };
      }
    });

    return formattedError;
  }

} 
