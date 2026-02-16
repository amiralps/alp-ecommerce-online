import {model, models, Schema} from "mongoose";

const cartSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: "User"},
  items: [
    {
      product: {type: Schema.Types.ObjectId, ref: "Post"},
      colors: [{color: String, quantity: Number}],
    },
  ],
  favorites: [{type: Schema.Types.ObjectId, ref: "Post"}],
  updatedAt: {
    type: Schema.Types.Date,
    default: () => Date.now(),
  },
},{versionKey: false});
const Cart = models.Cart || model("Cart", cartSchema);

export default Cart;
