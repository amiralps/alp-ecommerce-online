"use client";
import Link from "next/link";
import styles from "@/styles/Footer.module.css";
import {FaAngleLeft, FaRegCopyright} from "react-icons/fa";
import {IoIosArrowUp} from "react-icons/io";
import {useEffect, useState} from "react";

function Footer() {
  const [scroll, setScroll] = useState();
  function scrollTop() {
    window.scrollTo({top: 0, behavior: "instant"});
  }
  useEffect(() => {
  queueMicrotask(() => setScroll(window.pageYOffset));
    window.onscroll = () => {
      setScroll(window.pageYOffset);
    };
  }, []);
    return (
      <>
        <div
          onClick={() => {
            window.scrollTo({top: 0, behavior: "smooth"});
          }}
          className={`scrollTop ${scroll > 300 ? styles.on : ""}`}>
          <IoIosArrowUp />
        </div>
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.company}>
              <h1>عینک اپتیک</h1>
              <p>
                در این سایت شما میتونید بدون واسطه و با اطمینان کامل و تضمین
                سلامت کالا خریدتون رو انجام بدید ، همچنین در صورت مغایرت یا
                خرابی ، کالا را مرجوع کنید
              </p>
            </div>
            <div className={styles.links}>
              <h3>راهنمای سایت</h3>
              <ul>
                <li>
                  <Link
                    onClick={() => {
                      scrollTop();
                    }}
                    href={"/"}>
                    <FaAngleLeft />
                    خانه
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      scrollTop();
                    }}
                    href={"/products"}>
                    <FaAngleLeft />
                    محصولات
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      scrollTop();
                    }}
                    href={"/shopping-cart"}>
                    <FaAngleLeft />
                    سبد خرید
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      scrollTop();
                    }}
                    href={"/"}>
                    <FaAngleLeft />
                    علاقه مندی
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.aboutUs}>
              <h3>تماس با ما</h3>
              <ul>
                <li>
                  <Link href={"tel:+989960530222"}>
                    <FaAngleLeft />
                    گرفتن تماس
                  </Link>
                </li>
                <li>
                  <Link href={"mailto:amiralps@gmail.com"}>
                    <FaAngleLeft />
                    ارسال ایمیل
                  </Link>
                </li>
                <li>
                  <Link href={"sms:+989960530222"}>
                    <FaAngleLeft />
                    ارسال پیامک
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.copyRight}>
            <p>
              <FaRegCopyright /> کلیه حقوق متعلق به <span>عینک اپتیک</span>{" "}
              میباشد و هرگونه کپی برداری مجازات قانونی به دنبال خواهد داشت
            </p>
          </div>
          <div className={styles.tag}>
            <h4>designed by AmirAlps</h4>
          </div>
        </footer>
      </>
    );
}
export default Footer;
