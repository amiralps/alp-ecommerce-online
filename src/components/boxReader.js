"use client";
import {setBoxStorage} from "@/features/cart/cartSlice";
import {logIn} from "@/features/login/loginSlice";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
function BoxReader() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem("productsState")) {
      dispatch(
        setBoxStorage(JSON.parse(localStorage.getItem("productsState")))
      );
    }
    if (localStorage.getItem("userLogin")) {
      dispatch(logIn());
    }
  }, []);
  return <></>;
}
export default BoxReader;
