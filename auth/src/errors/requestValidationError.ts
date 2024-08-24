import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error{
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

    return formattedError;
  }

} 
