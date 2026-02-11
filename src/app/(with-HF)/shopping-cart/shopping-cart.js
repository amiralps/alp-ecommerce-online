"use client";
import {useDispatch, useSelector} from "react-redux";
import styles from "@/styles/ShoppingCart.module.css";
import Buttons from "@/components/Buttons";
import {Fragment, useEffect, useState} from "react";
import {priceFormat} from "@/helper/helper";
import {checkOut as doCheckOut} from "@/features/cart/cartSlice";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useShoppingCart} from "@/context/shopContext";
import Image from "next/image";
function ShoppingCartComponent({data: products}) {
  const [shoppingCart, setShoppingCart] = useShoppingCart();
  const {status} = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  // console.log(products, loading, error)
  const {checkOut, selectedItems, totalCount} = useSelector(
    (state) => state.cart
  );
  useEffect(() => {
    queueMicrotask(() => setIsLoaded(true));
  }, []);
  if (
    (!selectedItems.length && status === "unauthenticated") ||
    (shoppingCart !== null &&
      !shoppingCart?.totalCounts &&
      status === "authenticated")
  )
    return (
      <div className={styles.empty}>
        <h1>هیچ محصولی در سبدتان وجود ندارد</h1>
      </div>
    );
  return (
    <>
      <div className={styles.container}>
        <ul className={styles.pDetail}>
          {status === "unauthenticated" &&
            selectedItems.map((item, itemIndex) =>
              item.colors.map(
                (color, colorIndex) =>
                  !!color?.quantity && (
                    <Fragment key={`${itemIndex + 1}${colorIndex + 1}`}>
                      <li>
                        <Link href={`/products/${item.product}`}>
                          <img src={item.images[0]} alt={item.title} />
                        </Link>
                        <div className={styles.cartDTLBTN}>
                          <h1>{item.title}</h1>
                          <div className={styles.colorDiv}>
                            <span>رنگ : </span>
                            <div style={{background: color.code}}></div>
                            <p>{color.namecolor}</p>
                          </div>
                          <div className={styles.priceAndButtons}>
                            <Buttons
                              data={{
                                colorPick: colorIndex,
                                thisCart: item,
                                dispatch,
                                data: products.find((i) => i.id == item.id),
                              }}
                            />
                            <span>{priceFormat(color.price)}</span>
                          </div>
                        </div>
                      </li>
                      <div className={styles.break}></div>
                    </Fragment>
                  )
              )
            )}
          {status === "authenticated" &&
            shoppingCart &&
            shoppingCart.items.map((item, itemIndex) =>
              item.colors.map(
                (color, colorIndex) =>
                  !!color?.quantity && (
                    <Fragment key={color._id}>
                      <li>
                        <Link href={`/products/${item.product}`}>
                          <Image
                            src={
                              products.find((i) => i._id == item.product)
                                .images[0]
                            }
                            alt={
                              products.find((i) => i._id == item.product).title
                            }
                            width={150}
                            height={150}
                          />
                          {/* <img
                            src={
                              products.find((i) => i._id == item.product)
                                .images[0]
                            }
                            alt={
                              products.find((i) => i._id == item.product).title
                            }
                          /> */}
                        </Link>
                        <div className={styles.cartDTLBTN}>
                          <h1>
                            {products.find((i) => i._id == item.product).title}
                          </h1>
                          <div className={styles.colorDiv}>
                            <span>رنگ : </span>
                            <div
                              style={{
                                background: products
                                  .find((i) => i._id === item.product)
                                  .colors.find((c) => {
                                    return c.color === color.color;
                                  }).code,
                              }}></div>
                            <p>
                              {
                                products
                                  .find((i) => i._id === item.product)
                                  .colors.find((c) => c.color === color.color)
                                  .namecolor
                              }
                            </p>
                          </div>
                          <div className={styles.priceAndButtons}>
                            <Buttons
                              data={{
                                colorPick: products
                                  .find((i) => i._id == item.product)
                                  .colors.findIndex(
                                    (c) => c.color == color.color
                                  ),
                                thisCart: null,
                                dispatch,
                                data: products.find(
                                  (i) => i._id == item.product
                                ),
                              }}
                            />
                            <span>
                              {priceFormat(
                                products
                                  .find((i) => i._id == item.product)
                                  .colors.find((c) => c.name == color.name)
                                  .price
                              )}
                            </span>
                          </div>
                        </div>
                      </li>
                      <div className={styles.break}></div>
                    </Fragment>
                  )
              )
            )}
        </ul>
        {isLoaded && (
          <div className={styles.checkOutField}>
            {status === "unauthenticated" && (
              <button onClick={() => dispatch(doCheckOut())}>
                تکمیل سفارش
              </button>
            )}
            {status === "authenticated" && (
              <button
                onClick={async () => {
                  const data = await fetch("/api/carts", {
                    method: "POST",
                    body: JSON.stringify({method: "CHECK_OUT"}),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }).then((res) => res.json());
                  if (!data.error) setShoppingCart(data);
                }}>
                تکمیل سفارش
              </button>
            )}
            <div className={styles.price}>
              <p>جمع سبد خرید</p>
              {status === "unauthenticated" && (
                <span>{priceFormat(totalCount)}</span>
              )}
              {status === "authenticated" && shoppingCart && (
                <span>{priceFormat(shoppingCart.totalPrice)}</span>
              )}
            </div>
            <div className={styles.payedStatus}>
              <p>وضعیت</p>
              {status === "unauthenticated" && (
                <span>{checkOut ? "پرداخت شده" : "در انتظار پرداخت"}</span>
              )}
              {status === "authenticated" && shoppingCart && (
                <span>
                  {!shoppingCart.totalCounts
                    ? "پرداخت شده"
                    : "در انتظار پرداخت"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default ShoppingCartComponent;
