import mongoose from "mongoose";

//an interface that describes  the properties that are required to create a new user

interface userAttrs{
  email: string;
  password: string;
}

//an interface that describes the property that the user model has
interface UserModel extends mongoose.Model<UserDoc>{
  build(attrs:userAttrs):UserDoc;
}

//an interface that describes the properties that a user document has 
interface UserDoc extends mongoose.Document{
  email:string;
  password:string;
}


const userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
});

userSchema.statics.build = (arrts:userAttrs) => {
  return new User(arrts);
}
//above alone would have suffice if we were to use js we dont have to write this
//interface UserModel extends mongoose.Model<any>{
//   build(attrs:userAttrs):any;
// }

const User = mongoose.model<UserDoc,UserModel>('User' , userSchema);


export { User };