import connectDB from "@/database-features/connectDB";
import User from "@/database-features/UserModel";
import {compare} from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authOptions = {
  session: {strategy: "jwt", maxAge: 60 * 60 * 24 * 4},
  secret: process.env.NEXTAUTH_SECRET,
  // cookies: {
  //   sessionToken: {
  //     name: "myapp.jwt", // اسم cookie
  //     options: {
  //       maxAge: 60 * 60 * 24 * 4,
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //       path: "/",
  //     },
  //   },
  // },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const {userNameOrEmail, password/* , box */} = credentials;
        // const {selectedItems, totalCount, itemsCounter} = JSON.parse(box)
        try {
          await connectDB();
        } catch (err) {
          throw new Error("خطای اتصال به پایگاه داده");
        }
        if (!userNameOrEmail || !password) {
          throw new Error("لطفا اطلاعات خواسته شده را وارد کنید");
        }
        const user = await User.findOne({
          $or: [{userName: userNameOrEmail}, {email: userNameOrEmail}],
        });
        if (!user) throw new Error("لطفا ابتدا حساب کاربری ایجاد کنید");
        const isValid = await compare(password, user.hashedPassword);
        if (!isValid) throw new Error("رمز عبور نامعتبر است!");
        return {
          userName: user.userName,
          // email: user.email,
          // name: user.name,
          // lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.userName = user.userName;
        // token.email = user.email;
        // token.name = user.name;
        // token.lastName = user.lastName;
      }
      return token;
    },

    async session({session, token}) {
      session.user = {
        userName: token.userName,
        // email: token.email,
        // name: token.name,
        // lastName: token.lastName,
      };
      return session;
    },
  },
};
const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
