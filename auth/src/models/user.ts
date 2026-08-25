import mongoose from "mongoose";
import { Password } from "../services/password";

// An interfacethat describes the properties
// that are required to create a new User
export interface UserAttrs {
  email: string;
  password: string;
}

// An interface that descibes the preperties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Model has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret as { id?: typeof ret._id }).id = ret._id;
        delete (ret as { _id?: unknown })._id;
        delete (ret as { password?: string }).password;
        delete (ret as { __v?: number }).__v;
      },
    },
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
