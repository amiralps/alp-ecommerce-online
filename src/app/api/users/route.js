import connectDB from "@/database-features/connectDB";
import { getToken } from "@/database-features/serverFunctions";
import User from "@/database-features/UserModel";
import {compare, hash} from "bcryptjs";
import {NextResponse} from "next/server";

async function GET() {
  const session = await getToken();
  if (!session) {
    return NextResponse.json(
      {error: "احراز هویت با خطا مواجه شد!"},
      {status: 401}
    );
  }
  try {
    const {user: {userName}} = session;
    connectDB();
    const user = await User.findOne({userName});
    if (user.role === "admin") {
      const allUsers = await User.find()
      return NextResponse.json({user, allUsers, error: null})
    }
    return NextResponse.json({user, error: null});
  } catch (err) {
    return NextResponse.json({error: err.message}, {status: 404});
  }
}

async function POST(req) {
  try {
    const body = await req.json();
    connectDB();
    const {name, lastName, userName, email, password} = body;
    if (await User.findOne({$or: [{userName}, {email}]})) {
      return NextResponse.json(
        {error: "نام کاربری یا ایمیل از قبل وجود دارد!"},
        {status: 401}
      );
    }
    const hashedPassword = await hash(password, 12);
    const user = await User.insertOne({
      name,
      lastName,
      userName,
      email,
      hashedPassword,
      shoppingCart: null,
    });
    if (user) {
      return NextResponse.json(
        {
          status: "success",
          message: `کاربر با ایمیل ${email} ثبت شد`,
          error: null,
        },
        {status: 201, statusText: "user created"}
      );
    }
  } catch (err) {
    return NextResponse.json({error: "عملیات با خطا مواجه شد!"}, {status: 500});
  }
}
export {GET, POST};
