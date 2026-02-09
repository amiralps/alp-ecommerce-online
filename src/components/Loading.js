"use client";
import styles from "@/styles/Loading.module.css";
import MySunglasses from "@/svg/MySunglasses";
// import {useLayoutEffect, useState} from "react";
function Loading() {
  // const [isLoaded, setIsLoaded] = useState(false);
  // useLayoutEffect(() => {
  //   setIsLoaded(true);
  // }, []);
  return (
    <div className={styles.container}>
      <MySunglasses
        data={{
          duration: "3s",
          fill: "forwards",
          count: "infinite",
          ease: "linear",
          strokeWidth: "12",
        }}
      />
    </div>
  );
}
export default Loading;
