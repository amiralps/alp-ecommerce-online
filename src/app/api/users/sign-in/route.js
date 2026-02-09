import connectDB from "@/database-features/connectDB";
import User from "@/database-features/UserModel";
import {compare} from "bcryptjs";
import {NextResponse} from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    connectDB();
    const {userNameOrEmail, password} = body;
    const defindUser = await User.findOne({
      $or: [{userName: userNameOrEmail}, {email: userNameOrEmail}],
    });
    if (!defindUser) {
      return NextResponse.json({message: "کاربر وجود ندارد!"}, {status: 404});
    }
    const verifyPass = await compare(password, defindUser.hashedPassword);
    if (verifyPass) {
      return NextResponse.json({message: "اطلاعات درست است"}, {status: 200});
    } else {
      return NextResponse.json(
        {message: "نام کاربری یا رمز عبور اشتباه است!"},
        {status: 401}
      );
    }
  } catch (err) {
    return NextResponse.json(
      {message: "عملیات با خطا مواجه شد!", error: err.message},
      {status: 500}
    );
  }
}
