import connectDB from "./connectDB";
import Post from "./PostModel";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const getPost = async (_id) => {
  try {
    connectDB();
    if (!_id) {
      const posts = await Post.find();
      // const result = posts.map((item) => {
      //   const {title, description, images, colors, info} = item;
      //   return {
      //     id: item.id,
      //     title,
      //     description,
      //     images,
      //     colors: colors.map((c) => ({
      //       color: c.color,
      //       namecolor: c.namecolor,
      //       inventory: c.inventory,
      //       price: c.price,
      //       code: c.code,
      //     })),
      //     info,
      //   };
      // });
      return posts;
    }
    if (_id && !Number(_id)) {
      const post = await Post.findById(_id);
      if (post) {
        // const {title, description, images, colors, info} = post;
        // return {
        //   id,
        //   title,
        //   description,
        //   images,
        //   colors: colors.map((c) => ({
        //     color: c.color,
        //     namecolor: c.namecolor,
        //     inventory: c.inventory,
        //     price: c.price,
        //     code: c.code,
        //   })),
        //   info,
        // };
        return post._doc;
      }
    }
  } catch (err) {
    return undefined;
  }
};

export const getToken = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
