"use client";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Link from "next/link";
import {IoCloseCircleOutline} from "react-icons/io5";
import {GoHeart, GoHeartFill} from "react-icons/go";

import styles from "@/styles/ProductsDetail.module.css";
import styles2 from "@/styles/ProductsDetail2.module.css";
import Buttons from "@/components/Buttons.js";
import ThumbSlider from "@/components/ThumbSlider.js";
import {priceFormat, resizer} from "@/helper/helper.js";
import {LiaShoppingCartSolid} from "react-icons/lia";
import {favorite} from "@/features/cart/cartSlice.js";
import {useSession} from "next-auth/react";
import {useShoppingCart} from "@/context/shopContext";
function ProductsDetailComponent({data, data: {_id}}) {
  const [isMobile, setIsMobile] = useState(false);
  const [shoppingCart, setShoppingCart] = useShoppingCart();
  const {status} = useSession();
  const [colorName, setColorName] = useState(data.colors[0].color);
  const dispatch = useDispatch();
  const cartStatus = useSelector((state) => state.cart);
  useEffect(() => {
    const handleResize = () => setIsMobile(resizer(window.innerWidth));

    // مقدار اولیه
    handleResize();

    document.documentElement.style.setProperty("--scroll-scale", 1);
    const scrollHandler = () => {
      if (location.href.includes(`/products/${_id}`)) {
        const scrollY = window.scrollY;

        // scale val
        const scale = (1 + scrollY / -360).toFixed(3);

        // css variables
        document.documentElement.style.setProperty(
          "--scroll-scale",
          scale >= 0 ? scale : 0
        );
      }
    };

    window.addEventListener("scroll", () => {
      scrollHandler();
    });
    window.removeEventListener("scroll", () => {
      scrollHandler();
    });
    window.scrollTo({top: 0});
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [colorPick, setColorPick] = useState(0);
  const thisCart = cartStatus?.selectedItems?.find((item) => item._id == _id);
  return (
    <>
      <div className={styles2.back_box_favorite}>
        <button
          className={styles2.backButton}
          onClick={() => {
            history.back();
          }}>
          <IoCloseCircleOutline />
        </button>
        <div className={styles2.box_favorite}>
          <Link href="/shopping-cart">
            <LiaShoppingCartSolid />
          </Link>
          <button
            className={(() => {
              if (status === "unauthenticated") {
                if (
                  !cartStatus.favoriteItems.find(
                    (item) => item._id === data._id
                  )
                ) {
                  return null;
                } else {
                  return styles2.inFavorites;
                }
              } else if (status === "authenticated") {
                if (!shoppingCart?.favorites?.length) return null;
                if (shoppingCart.favorites.find((fav) => fav === data._id))
                  return styles2.inFavorites;
                return null;
              }
            })()}
            onClick={() => {
              if (status === "unauthenticated") dispatch(favorite(data));
              if (status === "authenticated")
                fetch("/api/carts", {
                  method: "POST",
                  body: JSON.stringify({method: "FIVES", product: data._id}),
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((data) => {
                    setShoppingCart(data);
                  });
            }}>
            <GoHeart />
            <GoHeartFill className={styles2.fillHeart} />
          </button>
        </div>
      </div>
      <ThumbSlider data={data} />
      <div className={styles.productDetails}>
        <h1>{data.title}</h1>
        <p>{data.description}</p>
        <p>رنگ : {data.colors[colorPick].namecolor}</p>
        <ul className={styles.colors}>
          {data.colors.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                setColorPick(index);
                setColorName(item.color);
              }}
              className={colorPick == index ? styles.active : null}>
              <div style={{backgroundColor: item.code}}></div>
              {isMobile ? <p>{item.namecolor}</p> : null}
            </li>
          ))}
        </ul>
        <div className={styles2.addToBox}>
          <Buttons data={{thisCart, colorPick, dispatch, data, colorName}} />
          <span>{priceFormat(data.colors[colorPick].price)}</span>
        </div>
        <p className={styles.description}>
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
          <br />
          {data.description}
        </p>
      </div>
    </>
  );
}
export default ProductsDetailComponent;
