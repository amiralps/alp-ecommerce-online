import styles from "@/styles/Buttons.module.css";
import {TbShoppingCartDown} from "react-icons/tb";
import {FaPlus, FaMinus} from "react-icons/fa6";
import {LuTrash2} from "react-icons/lu";

import {
  removeItem,
  addItem,
  increment,
  decrement,
} from "@/features/cart/cartSlice.js";
import {useTransition} from "react";
import {useSession} from "next-auth/react";
import { useShoppingCart } from "@/context/shopContext";
function Buttons({data: {colorPick, thisCart, dispatch, data}}) {
  const [shoppingCart, setShoppingCart] = useShoppingCart();
  const {status} = useSession();
  const [isPending, startTransition] = useTransition();
  const addToBox = () => {
    startTransition(async () => {
      const res = await fetch("/api/carts", {
        method: "POST",
        body: JSON.stringify({
          productId: data._id,
          color: data.colors[colorPick].color,
          method: "INCREMENT",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setShoppingCart(res);
    });
  };
  const removeFromBox = () => {
    startTransition(async () => {
      const res = await fetch("/api/carts", {
        method: "POST",
        body: JSON.stringify({
          method: "DECREMENT",
          productId: data._id,
          color: data.colors[colorPick].color,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setShoppingCart(res);
    });
  };
  const itemQuantity = () => {
    if (status === "authenticated") {
      return (
        shoppingCart?.items
          ?.find(
            (item) => item.product === data._id
          )
          ?.colors?.find((c) => c.color === data.colors[colorPick].color)
          ?.quantity || 0
      );
    } else if (status === "unauthenticated") {
      return thisCart?.colors[colorPick]?.quantity || 0;
    } else return 0;
  };

  return (
    <div className={`${styles.buttons} updateButtons`}>
      <>
        {/* add and increase */}
        <button
          className={`${styles.putBtn}${
            itemQuantity() ? ` ${styles.active}` : ""
          }`}
          onClick={() => {
            if (!isPending) {
              if (status === "unauthenticated") {
                !itemQuantity()
                  ? dispatch(addItem({data, colorIndex: colorPick}))
                  : dispatch(increment({data, colorIndex: colorPick}));
              } else if (status === "authenticated") {
                if (itemQuantity() !== data.colors[colorPick].inventory)
                  addToBox();
              }
            }
          }}>
          <div className={styles.add}>
            <p>افزودن به سبد</p>
            <TbShoppingCartDown />
          </div>
          <FaPlus className={styles.increase} />
        </button>
        {<h2>{!isPending ? itemQuantity() : "•••"}</h2>}
        {/* <h2>
          {status === "authenticated" && (!isPending ? itemQuantity() : )}
          {status === "unauthenticated" &&
            (thisCart?.colors[colorPick]?.quantity || 0)}
        </h2> */}
        {/* decrease and remove */}
        <button
          className={`${styles.popBtn}${
            itemQuantity() == 1
              ? ` ${styles.active}`
              : itemQuantity() > 1
              ? ` ${styles.active + " " + styles.morethan1}`
              : ""
          }`}
          onClick={() => {
            if (!isPending) {
              if (status === "unauthenticated") {
                itemQuantity() > 1
                  ? dispatch(decrement({data, colorIndex: colorPick}))
                  : dispatch(removeItem({data, colorIndex: colorPick}));
              } else if (status === "authenticated") {
                if (itemQuantity() > 0) removeFromBox();
              }
            }
          }}>
          <FaMinus className={styles.decrease} />
          <LuTrash2 className={styles.remove} />
        </button>
      </>
    </div>
  );
}
export default Buttons;
