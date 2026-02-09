import Cart from "@/database-features/CartModel";
import connectDB from "@/database-features/connectDB";
import Post from "@/database-features/PostModel";
import {getToken} from "@/database-features/serverFunctions";
import User from "@/database-features/UserModel";
import {NextResponse} from "next/server";

const POST = async (req) => {
  const session = await getToken();
  if (!session) {
    return NextResponse.json(
      {error: "احراز هویت با خطا مواجه شد!"},
      {status: 401}
    );
  }
  try {
    const {
      user: {userName},
    } = session;
    const json = await req.json();
    const {method} = json;
    connectDB();
    const user = await User.findOne({userName});
    if (method === "CHECK_OUT") {
      try {
        await Cart.findByIdAndDelete(user.shoppingCart);
        user.shoppingCart = null;
        await user.save();
        return NextResponse.json(
          {message: "موفق!", text: "سبد حذف شد!", error: null},
          {status: 200}
        );
      } catch (err) {
        return NextResponse.json({error: "خطای غیر منتظره!"}, {status: 500});
      }
    }
    if (method === "INCREMENT") {
      try {
        const {productId, color} = json;
        const post = await Post.findById(productId);
        if (!user.shoppingCart) {
          const cart = await Cart.create({
            user: user._id,
            items: [
              {
                product: post._id,
                colors: [{color, quantity: 1}],
              },
            ],
            totalPrice: post.colors.find((c) => c.color === color).price,
            totalCounts: 1,
          });
          await cart.save();
          user.shoppingCart = cart._id;
          await user.save();
          await cart; //.populate("items.product");
          return NextResponse.json(
            {message: "موفق!", ...cart._doc},
            {status: 201}
          );
        } else {
          const cart = await Cart.findById(user.shoppingCart); //.populate("items.product");
          const thisCart = cart.items.findIndex(
            (i) => String(i.product._id) === String(post._id)
          );
          if (thisCart === -1) {
            cart.items.push({
              product: post._id,
              colors: [{color, quantity: 1}],
            });
            cart.totalPrice += post.colors.find((c) => c.color === color).price;
            cart.totalCounts += 1;
          } else {
            const thisColor = cart.items[thisCart].colors.findIndex(
              (c) => c.color === color
            );
            if (thisColor === -1) {
              cart.items[thisCart].colors.push({
                color,
                quantity: 1,
              });
              cart.totalPrice += post.colors.find(
                (c) => c.color === color
              ).price;
              cart.totalCounts += 1;
            } else {
              cart.items[thisCart].colors[thisColor].quantity += 1;
              cart.totalPrice += post.colors.find(
                (c) => c.color === color
              ).price;
              cart.totalCounts += 1;
            }
          }
          cart.updatedAt = Date.now();
          await cart.save();
          return NextResponse.json(
            {message: "موفق!", ...cart._doc},
            {status: 201}
          );
        }
      } catch (err) {
        return NextResponse.json(
          {message: "درخواست با خطا مواجه شد!", error: err.message},
          {status: 500}
        );
      }
    }
    if (method === "DECREMENT") {
      try {
        const {productId, color} = json;
        const post = await Post.findById(productId);
        const cart = await Cart.findById(user.shoppingCart); //.populate("items.product");
        const thisCart = cart.items.findIndex(
          (i) => String(i.product._id) === String(post._id)
        );
        if (thisCart === -1) {
          return NextResponse.json(
            {message: "محصول مورد نظر در سبدتان وجود ندارد!"},
            {status: 404}
          );
        } else {
          const thisColor = cart.items[thisCart].colors.findIndex(
            (c) => c.color === color
          );
          if (thisColor === -1) {
            return NextResponse.json(
              {message: "رنگ مورد نظر در سبدتان وجود ندارد!"},
              {status: 404}
            );
          }
          // ;;;;;;;;;;;;;;;;;
          if (
            cart.items.length === 1 &&
            cart.items[thisCart].colors.length === 1 &&
            cart.items[thisCart].colors[thisColor].quantity === 1
          ) {
            await Cart.findByIdAndDelete(user.shoppingCart);
            user.shoppingCart = null;
            await user.save();
            return NextResponse.json(
              {message: "موفق!", text: "سبد حذف شد!"},
              {status: 200}
            );
          }
          if (
            cart.items[thisCart].colors.length === 1 &&
            cart.items[thisCart].colors[thisColor].quantity === 1
          ) {
            cart.items = cart.items.filter((item, index) => index !== thisCart);
            cart.totalPrice -= post.colors.find((c) => c.color === color).price;
            cart.totalCounts -= 1;
            await cart.save();
            return NextResponse.json(
              {message: "موفق!", ...cart._doc},
              {status: 200}
            );
          }
          if (cart.items[thisCart].colors[thisColor].quantity === 1) {
            cart.items[thisCart].colors = cart.items[thisCart].colors.filter(
              (c) => {
                return c.color != color;
              }
            );
            cart.totalPrice -= post.colors.find((c) => c.color === color).price;
            cart.totalCounts -= 1;
            await cart.save();
            return NextResponse.json(
              {message: "موفق!", ...cart._doc},
              {status: 200}
            );
          }
          // ;;;;;;;;;;;;;;;;
          cart.items[thisCart].colors[thisColor].quantity -= 1;
          cart.totalPrice -= post.colors.find((c) => c.color === color).price;
          cart.totalCounts -= 1;
        }
        cart.updatedAt = Date.now();
        await cart.save();
        return NextResponse.json(
          {message: "موفق!", ...cart._doc},
          {status: 201}
        );
      } catch (err) {
        return NextResponse.json({error: "عملیات ناموفق بود!"}, {status: 400});
      }
    }
  } catch (err) {
    return NextResponse.json({error: "خطای غیر منتظره!"}, {status: 500});
  }
  return NextResponse.json({error: "خطای غیر منتظره!"}, {status: 500});
};

const GET = async () => {
  const session = await getToken();
  if (!session) {
    return NextResponse.json(
      {error: "احراز هویت با خطا مواجه شد!"},
      {status: 401}
    );
  }
  try {
    const {
      user: {userName},
    } = session;
    connectDB();
    const user = await User.findOne({userName});
    const cart = await Cart.findById(user?.shoppingCart); //.populate("items.product");
    if (cart) {
      return NextResponse.json({message: "موفق!", ...cart._doc});
    }
    return NextResponse.json({message: "سبد خرید خالی است!"});
  } catch (err) {
    return NextResponse.json(
      {message: "خطای غیر منتظره رخ داده", error: err.message},
      {status: 500}
    );
  }
};

// export const PUT = async (req) => {
//   const body = await req.json()
//   console.log(body)
//   return NextResponse.json({message: "موفق"},{status: 200})
// }
export {GET, POST/* , PUT */};
