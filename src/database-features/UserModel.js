import {model, models, Schema} from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    email: {type: String, unique: true},
    userName: {type: String, unique: true},
    hashedPassword: String,
    shoppingCart: {type: Schema.Types.ObjectId, ref: "Cart"},
    role: {type: String, default: "user"},
    createdAt: {
      type: Schema.Types.Date,
      default: () => Date.now(),
    },
  },
  {versionKey: false}
);
const User = models.User || model("User", userSchema);

export default User;
