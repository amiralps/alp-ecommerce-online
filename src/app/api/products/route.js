import connectDB from "@/database-features/connectDB";
import Post from "@/database-features/PostModel";
import {NextResponse} from "next/server";

async function GET() {
  connectDB();
  try {
    const posts = await Post.find().lean();
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({error: err.message},{status: 404});
  }
}

async function POST() {
  return NextResponse.json(
    {status: "success"},
    {status: 201, statusText: "user created"}
  );
}

export {GET, POST};
