import Cart from "@/database-features/CartModel";
import connectDB from "@/database-features/connectDB";
import Post from "@/database-features/PostModel";
import {getToken} from "@/database-features/serverFunctions";
import User from "@/database-features/UserModel";
import {NextResponse} from "next/server";

const priceAndItems = (items, posts) => {
  let totalPrice = 0,
    totalCounts = 0;
  items.map((i) => {
    i.colors.map((c) => {
      totalCounts += c.quantity;
      totalPrice +=
        posts
          .find((p) => String(p._id) == String(i.product))
          .colors.find((color) => color.color == c.color).price * c.quantity;
    });
  });
  return {totalPrice, totalCounts};
};
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
      user: {id},
    } = session;
    const json = await req.json();
    const {method} = json;
    connectDB();
    const user = await User.findById(id).populate("shoppingCart");
    if (method === "FIVES") {
      const {product} = json;
      if (user.shoppingCart) {
        const cart = await Cart.findById(user.shoppingCart);
        const favIndex = cart?.favorites.findIndex(
          (f) => String(f) == String(product)
        );
        if (favIndex === -1) {
          cart.favorites.push(String(product));
          await cart.save();
        } else {
          if (cart.favorites.length <= 1) {
            if (!cart.items.length) {
              await Cart.findByIdAndDelete(user.shoppingCart);
              user.shoppingCart = null;
              await user.save();
              return NextResponse.json(
                {message: "موفق!", text: "سبد حذف شد!", error: null},
                {status: 200}
              );
            } else {
              cart.favorites = [];
              await cart.save();
            }
          } else {
            cart.favorites = cart.favorites.filter((i) => {
              return String(i) != String(product);
            });
            await cart.save();
          }
        }
        const posts = await Post.find().lean();
        const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
        return NextResponse.json(
          {message: "موفق", ...cart._doc, totalCounts, totalPrice},
          {status: 201}
        );
      } else {
        const cart = await Cart.create({
          user: user._id,
          items: [],
          favorites: [String(product)],
        });
        user.shoppingCart = cart._id;
        await user.save();
        return NextResponse.json(
          {message: "موفق", ...cart._doc, totalCounts: 0, totalPrice: 0},
          {status: 201}
        );
      }
    }
    if (method === "CHECK_OUT") {
      try {
        if (
          !user?.shoppingCart.favorites.length &&
          user?.shoppingCart.items.length
        ) {
          await Cart.findByIdAndDelete(user.shoppingCart);
          user.shoppingCart = null;
          await user.save();
          return NextResponse.json(
            {message: "موفق!", text: "سبد حذف شد!", error: null},
            {status: 200}
          );
        } else {
          const cart = await Cart.findById(user.shoppingCart);
          cart.items = [];
          await cart.save();
          return NextResponse.json(
            {message: "موفق!", text: "سبد حذف شد!", error: null},
            {status: 200}
          );
        }
      } catch (err) {
        return NextResponse.json({error: "خطای غیر منتظره!"}, {status: 500});
      }
    }
    const posts = await Post.find().lean();
    if (method === "INCREMENT") {
      try {
        const {productId, color} = json;
        const post = await Post.findById(productId).lean();
        if (!user.shoppingCart) {
          const cart = await Cart.create({
            user: user._id,
            items: [
              {
                product: post._id,
                colors: [{color, quantity: 1}],
              },
            ],
            favorites: [],
          });
          // await cart.save();
          user.shoppingCart = cart._id;
          await user.save();
          // await cart.populate("items.product");
          const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
          return NextResponse.json(
            {message: "موفق!", ...cart._doc, totalPrice, totalCounts},
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
          } else {
            const thisColor = cart.items[thisCart].colors.findIndex(
              (c) => c.color === color
            );
            if (thisColor === -1) {
              cart.items[thisCart].colors.push({
                color,
                quantity: 1,
              });
            } else {
              cart.items[thisCart].colors[thisColor].quantity += 1;
            }
          }
          cart.updatedAt = Date.now();
          await cart.save();
          const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
          return NextResponse.json(
            {message: "موفق!", ...cart._doc, totalPrice, totalCounts},
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
            await cart.save();
            const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
            return NextResponse.json(
              {message: "موفق!", ...cart._doc, totalPrice, totalCounts},
              {status: 201}
            );
          }
          if (cart.items[thisCart].colors[thisColor].quantity === 1) {
            cart.items[thisCart].colors = cart.items[thisCart].colors.filter(
              (c) => {
                return c.color != color;
              }
            );
            await cart.save();
            const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
            return NextResponse.json(
              {message: "موفق!", ...cart._doc, totalPrice, totalCounts},
              {status: 201}
            );
          }
          // ;;;;;;;;;;;;;;;;
          cart.items[thisCart].colors[thisColor].quantity -= 1;
        }
        cart.updatedAt = Date.now();
        await cart.save();
        const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
        return NextResponse.json(
          {message: "موفق!", ...cart._doc, totalPrice, totalCounts},
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
      user: {id},
    } = session;
    connectDB();
    const user = await User.findById(id); //.populate("items.product");
    const posts = await Post.find().lean();
    if (user?.shoppingCart) {
      const cart = await Cart.findById(user.shoppingCart);
      const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
      return NextResponse.json(
        {message: "موفق!", ...cart._doc, totalPrice, totalCounts},
        {status: 201}
      );
    }
    return NextResponse.json({message: "سبد خرید خالی است!"});
  } catch (err) {
    return NextResponse.json(
      {message: "خطای غیر منتظره رخ داده", error: err.message},
      {status: 500}
    );
  }
};

export const PUT = async (req) => {
  const body = await req.json();
  const session = await getToken();
  if (!session) {
    return NextResponse.json(
      {error: "احراز هویت با خطا مواجه شد!"},
      {status: 401}
    );
  }
  try {
    const {
      user: {id},
    } = session;
    connectDB();
    const {totalPrice, totalCounts, items, favorites} = body;
    const user = await User.findOne(id);
    const posts = await Post.find().lean();
    if (!user.shoppingCart) {
      if ((totalCounts && totalPrice && items.length) || favorites.length) {
        const cart = await Cart.create({
          user: user._id,
          items,
          favorites,
        });
        user.shoppingCart = cart._id;
        await user.save();
        const {totalCounts, totalPrice} = priceAndItems(items, posts);
        return NextResponse.json(
          {message: "موفق", ...cart._doc, totalCounts, totalPrice},
          {status: 201}
        );
      }
    } else {
      const cart = await Cart.findById(user.shoppingCart);
      items.map((i) => {
        const thisItem = cart.items.findIndex(
          (item) => String(i.product) == String(item.product)
        );
        const post = posts.find(
          (post) => String(post._id) == String(i.product)
        );
        if (thisItem === -1) {
          cart.items.push({...i});
        } else {
          i.colors.map((c) => {
            const thisColor = cart.items[thisItem]?.colors.findIndex(
              (color) => {
                return String(color.color) == String(c.color);
              }
            );
            if (thisColor > -1) {
              cart.items[thisItem].colors[thisColor].quantity + c.quantity <=
              post.colors.find((color) => color.color == c.color).inventory
                ? (cart.items[thisItem].colors[thisColor].quantity +=
                    c.quantity)
                : (cart.items[thisItem].colors[thisColor].quantity = 10);
            } else {
              cart.items[thisItem]?.colors.push({...c});
            }
          });
        }
      });
      favorites.map((fav) => {
        const favIndex = cart.favorites.findIndex((f) => f == fav);
        if (favIndex === -1) cart.favorites.push(fav);
      });
      await cart.save();
      const {totalCounts, totalPrice} = priceAndItems(cart.items, posts);
      return NextResponse.json(
        {message: "موفق", ...cart._doc, totalCounts, totalPrice},
        {status: 201}
      );
    }
    return NextResponse.json({error: "عملیات با خطا مواجه شد"}, {status: 400});
  } catch (err) {
    return NextResponse.json(
      {error: "خطایی رخ داده است", errorMessage: err.message},
      {status: 500}
    );
  }
};
export {GET, POST, PUT};
