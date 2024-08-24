import { ValidationError } from 'express-validator';

interface CustomErrorStructure{
  statusCode:number;
  serializeErrors():{
    message:string;
    feild?:string;
    type?:string;
  }[];
}

export class RequestValidationError extends Error implements CustomErrorStructure{
  errors: ValidationError[];
  statusCode = 400;

  constructor(errors: ValidationError[]){
    super();
    this.errors = errors;

    //only because we are extending the built in class
    Object.setPrototypeOf(this , RequestValidationError.prototype);
  }

  serializeErrors(){
    const formattedError = this.errors.map((entry) => {
      if ('path' in entry) {
        console.log("path " , entry.path);
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
