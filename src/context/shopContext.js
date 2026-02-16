"use client";
import {useSession} from "next-auth/react";
import {createContext, useContext, useEffect, useState} from "react";

export const shopContext = createContext();
function ShoppingCartContext({children}) {
  const {status} = useSession();
  const [shoppingCart, setShoppingCart] = useState(null);
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/carts")
        .then((res) => res.json())
        .then((data) => setShoppingCart(data));
      const handler = () => {
        if (document.visibilityState === "visible") {
          console.log(status);
          fetch("/api/carts")
            .then((res) => res.json())
            .then((data) => setShoppingCart(data));
        }
      };
      document.addEventListener("visibilitychange", () => handler());
      return document.removeEventListener("visibilitychange", () => handler());
    }
  }, [status]);

  return (
    <shopContext.Provider value={[shoppingCart, setShoppingCart]}>
      {children}
    </shopContext.Provider>
  );
}
export default ShoppingCartContext;

export const useShoppingCart = () => {
  const [shoppingCart, setShoppingCart] = useContext(shopContext);
  return [shoppingCart, setShoppingCart];
};
