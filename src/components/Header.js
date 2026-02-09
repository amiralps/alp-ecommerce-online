"use client";
import Link from "next/link";
import styles from "@/styles/Header.module.css";
import TMStyle from "@/styles/ToggleMenu.module.css";
import {LiaShoppingCartSolid} from "react-icons/lia";
import {/* useDispatch, */ useSelector} from "react-redux";
import {RiMoonClearLine} from "react-icons/ri";
import {BsFillSunFill} from "react-icons/bs";
import {useEffect, useRef, useState} from "react";
import {HiHome} from "react-icons/hi2";
import {HiOutlineLogin, HiOutlineLogout} from "react-icons/hi";
import {AiFillProduct} from "react-icons/ai";
// import {logOut} from "@/features/login/loginSlice";
import LogOutAlert from "./LogOutAlert";
import {resizer} from "@/helper/helper.js";
import {useSession} from "next-auth/react";
import {RotatingLines} from "react-loader-spinner";
import {useShoppingCart} from "@/context/shopContext";

function Header() {
  const [shoppingCart] = useShoppingCart();
  const {status} = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [alert, setAlert] = useState("off");
  const [isMobile, setIsMobile] = useState(null);
  // const dispatch = useDispatch();
  // const {userLogin} = useSelector((state) => state.login);
  const toggleMenu = useRef(null);
  const [theme, setTheme] = useState();
  function themeHandler() {
    if (theme === "Dark") {
      localStorage.setItem("theme", "Light");
      document.documentElement.classList.remove("Dark");
      setTheme("Light");
    } else {
      localStorage.setItem("theme", "Dark");
      document.documentElement.classList.add("Dark");
      setTheme("Dark");
    }
  }
  function scrollTop() {
    window.scrollTo({top: 0 /* , behavior: "instant" */});
  }
  function classRemover() {
    if (toggleMenu.current.className.includes(TMStyle.open)) {
      scrollTop();
      toggleMenu.current.classList.remove(TMStyle.open);
      document.documentElement.classList.remove("disable-scroll");
    }
  }
  function disableScroll() {
    document.documentElement.classList.add("disable-scroll");
  }
  function enableScroll() {
    document.documentElement.classList.remove("disable-scroll");
  }
  const {selectedItems, itemsCounter, totalCount} = useSelector(
    (state) => state.cart
  );
  useEffect(() => {
  queueMicrotask(() => setTheme(localStorage.getItem("theme")));
  queueMicrotask(() => setIsLoaded(true));
  queueMicrotask(() => setIsMobile(resizer(window.innerWidth)));
    window.addEventListener("resize", () => {
      setIsMobile(resizer(window.innerWidth));
      if (!isMobile) {
        if (toggleMenu?.current?.className?.includes(TMStyle.open)) {
          toggleMenu.current.classList.remove(TMStyle.open);
          enableScroll();
        }
      }
    });
    return window.removeEventListener("resize", () => {
      setIsMobile(resizer(window.innerWidth));
      if (!isMobile) {
        if (toggleMenu.current.className.includes(TMStyle.open)) {
          toggleMenu.current.classList.remove(TMStyle.open);
          enableScroll();
        }
      }
    });
  }, []);
  // if (isLoaded)
  return (
    <>
      {/* desktop Navbar */}
      <header className={styles.header}>
        <div className={styles.desktopNavBar}>
          <div className={styles.logo}>
            <h3>
              <Link
                onClick={() => {
                  scrollTop();
                }}
                href={"/"}>
                <img src="/policy-sunglasses.svg" alt="logo" />
                عینک اپتیک
              </Link>
            </h3>
          </div>
          <div className={styles.centerdiv}>
            <ul>
              <li>
                {/* navlink */}
                <Link
                  onClick={() => {
                    scrollTop();
                  }}
                  href="/">
                  خانه
                </Link>
              </li>
              <li>
                {/* navlink */}
                <Link
                  onClick={() => {
                    scrollTop();
                  }}
                  href="/products">
                  محصولات
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.leftdiv}>
            <ul>
              <li>
                {status === "unauthenticated" && (
                  <Link href={"/login"} className={TMStyle.login}>
                    <HiOutlineLogin />
                  </Link>
                )}
                {status === "authenticated" && (
                  <button
                    className={TMStyle.logout}
                    onClick={() => {
                      setAlert("on");
                      disableScroll();
                    }}>
                    <HiOutlineLogout />
                  </button>
                )}
                {status !== "authenticated" && status !== "unauthenticated" && (
                  <div className={TMStyle.onLoading}>
                    <RotatingLines
                      visible={true}
                      height="26"
                      width="26"
                      color="grey"
                      strokeWidth="4"
                      animationDuration="0.75"
                      ariaLabel="rotating-lines-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                )}
              </li>
              <li className="cart">
                {/* navlink */}
                <Link
                  onClick={() => {
                    scrollTop();
                  }}
                  href="/shopping-cart">
                  <LiaShoppingCartSolid />
                  {!!itemsCounter &&
                    isLoaded &&
                    status === "unauthenticated" && (
                      <div className="number">{itemsCounter}</div>
                    )}
                  {!!shoppingCart?.totalCounts &&
                    isLoaded &&
                    status === "authenticated" && (
                      <div className="number">{shoppingCart.totalCounts}</div>
                    )}
                </Link>
              </li>
              <li>
                <button
                  className={styles.themeBtn}
                  onClick={() => {
                    themeHandler();
                  }}>
                  <RiMoonClearLine className={styles.moon} />
                  <BsFillSunFill className={styles.sun} />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* mobile Navbar */}
        <div className={styles.mobileNavBar}>
          <div>
            {status === "unauthenticated" && (
              <Link href={"/login"} className={TMStyle.login}>
                <HiOutlineLogin />
              </Link>
            )}
            {status === "authenticated" && (
              <button
                className={TMStyle.logout}
                onClick={() => {
                  setAlert("on");
                  disableScroll();
                }}>
                <HiOutlineLogout />
              </button>
            )}
            {status !== "authenticated" && status !== "unauthenticated" && (
              <div className={TMStyle.onLoading}>
                <RotatingLines
                  visible={true}
                  height="22"
                  width="22"
                  color="grey"
                  strokeWidth="4"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </div>
            )}
          </div>
          <div className={styles.logo}>
            <h3>
              <Link href={"/"}>
                <img src="/policy-sunglasses.svg" alt="logo" />
                عینک اپتیک
              </Link>
            </h3>
          </div>
          <div
            className={TMStyle.menu}
            ref={toggleMenu}
            onClick={() => {
              if (toggleMenu.current.className.includes(TMStyle.open)) {
                toggleMenu.current.classList.remove(TMStyle.open);
                enableScroll();
              } else {
                toggleMenu.current.classList.add(TMStyle.open);
                disableScroll();
              }
            }}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div
            className={TMStyle.leftContainer}
            onClick={() => {
              classRemover();
            }}></div>
          <div className={TMStyle.list}>
            <ul>
              <li>
                <button
                  className={styles.themeBtn}
                  onClick={() => {
                    themeHandler();
                  }}>
                  <RiMoonClearLine className={styles.moon} />
                  <BsFillSunFill className={styles.sun} />
                </button>
                <div className="cart">
                  {/* navlink */}
                  <Link
                    href="/shopping-cart"
                    onClick={() => {
                      classRemover();
                    }}>
                    <LiaShoppingCartSolid />
                    {!!itemsCounter &&
                      isLoaded &&
                      status === "unauthenticated" && (
                        <div className="number">{itemsCounter}</div>
                      )}
                    {!!shoppingCart?.totalCounts &&
                      isLoaded &&
                      status === "authenticated" && (
                        <div className="number">{shoppingCart.totalCounts}</div>
                      )}
                  </Link>
                </div>
              </li>
              <li className={TMStyle.URLs}>
                {/* navlink */}
                <Link
                  href={"/"}
                  onClick={() => {
                    classRemover();
                  }}>
                  <HiHome /> خانه
                </Link>
              </li>
              <li className={TMStyle.URLs}>
                {/* navlink */}
                <Link
                  href={"/products"}
                  onClick={() => {
                    classRemover();
                  }}>
                  <AiFillProduct /> محصولات
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <LogOutAlert
        data={{
          alert,
          setAlert,
          enableScroll,
          scrollTop,
        }}
      />
    </>
  );
}
export default Header;
