import {model, models, Schema} from "mongoose";

const postSchema = new Schema({
  id: Number,
  title: String,
  description: String,
  images: [String],
  colors: [
    {
      color: String,
      namecolor: String,
      inventory: Number,
      price: Number,
      code: String,
    },
  ],
  info: {saledcounts: Number, rate: Number},
},{versionKey: false});
const Post = models.Post || model("Post", postSchema);

export default Post;
