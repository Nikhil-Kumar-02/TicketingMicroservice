import mongoose from "mongoose";
import { Password } from "../services/password";

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


const userSchema = new mongoose.Schema(
  {
    email : {
      type : String,
      required : true,
    },
    password : {
      type : String,
      required : true,
    },
  },
  {
    toJSON: {
      transform(doc,ret){
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre("save" , async function (next) {
  if(this.isModified("password")){
    const hashed = await Password.toHash(this.password);
    this.password = hashed;
  }
  next();
})

userSchema.statics.build = (arrts:userAttrs) => {
  return new User(arrts);
}
//above alone would have suffice if we were to use js we dont have to write this
//interface UserModel extends mongoose.Model<any>{
//   build(attrs:userAttrs):any;
// }

const User = mongoose.model<UserDoc,UserModel>('User' , userSchema);


export { User };