interface CustomErrorStructure{
  statusCode:number;
  serializeErrors():{
    message:string;
    feild?:string;
    type?:string;
  }[];
}


export class DatabaseConnectionError extends Error implements CustomErrorStructure{
  statusCode = 500;
  reason = "Error connecting to database";

  constructor(){
    super();

    Object.setPrototypeOf(this , DatabaseConnectionError.prototype);
  }

  serializeErrors(){
    return [
      {message : this.reason}
    ];
  }
}