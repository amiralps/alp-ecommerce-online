"use client";
import {useEffect, useRef} from "react";
import {priceFormat} from "@/helper/helper";
import styles from "@/styles/Card.module.css";
import Link from "next/link";
import Image from "next/image";
export default function Card({data: {_id, title, images, colors}}) {
  const card = useRef(null);
  function scroller() {
    if (card.current) {
      if (
        document.documentElement.scrollTop +
          document.documentElement.clientHeight >
        card.current.offsetTop + card.current.offsetHeight - 80
      ) {
        card.current.classList.add(styles.opened);
      } else {
        card.current.classList.remove(styles.opened);
      }
    }
  }
  const directMotion = () => {
    if (card.current) {
      if (
        card.current.offsetLeft >
        document.documentElement.offsetWidth -
          (card.current.offsetLeft + card.current.offsetWidth)
      ) {
        card.current.classList.remove("right");
        card.current.classList.remove("left");
        card.current.classList.remove("center");
        card.current.classList.add("right");
      } else if (
        card.current.offsetLeft <
        document.documentElement.offsetWidth -
          (card.current.offsetLeft + card.current.offsetWidth)
      ) {
        card.current.classList.remove("right");
        card.current.classList.remove("left");
        card.current.classList.remove("center");
        card.current.classList.add("left");
      } else {
        card.current.classList.remove("right");
        card.current.classList.remove("left");
        card.current.classList.remove("center");
        card.current.classList.add("center");
      }
    }
  };
  useEffect(() => {
    directMotion();
    if (card.current) {
      // const timer = setTimeout(() => {
      scroller();
      card.current.style.transition = ".5s ease-in-out";
      // window.scrollTo({top: 0});
      //   clearTimeout(timer);
      // }, 10);
    }

    window.addEventListener("scroll", () => {
      scroller();
    });
    window.removeEventListener("scroll", () => {
      scroller();
    });
    window.addEventListener("resize", () => {
      directMotion();
      scroller();
    });
    window.removeEventListener("resize", () => {
      directMotion();
      scroller();
    });
  }, []);
  return (
    <li ref={card} className={styles.li}>
      <Link className={styles.link} href={`/products/${_id}`}>
        <div className={styles.card}>
          <Image className={styles.bgimage} src={images[0]} alt={title} width={350} height={350} />
          {/* <img
            loading="lazy"
            decoding="async"
            ></img> */}
          <h1>{title}</h1>
          <p>{priceFormat(colors[0].price)}</p>
        </div>
      </Link>
    </li>
  );
}
