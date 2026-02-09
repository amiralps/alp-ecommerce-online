import {NextResponse} from "next/server";
import connectDB from "@/database-features/connectDB";
import Post from "@/database-features/PostModel";

export async function GET(req, {params}) {
  const {productID: id} = await params;
  if (Number(id)) {
    connectDB();
    const post = await Post.findOne({id: id});
    if (post) {
      return NextResponse.json(post);
    }
  }
  return NextResponse.json(
    {error: "product was not found!", status: 404},
    {status: 404}
  );
}
