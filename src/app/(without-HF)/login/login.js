"use client";

import styles from "@/styles/Login.module.css";
import {/* useDispatch,  */ useSelector} from "react-redux";
// import {logIn} from "@/features/login/loginSlice.js";
import {useSignerForm} from "./formContext";
import {signIn} from "next-auth/react";
import toast from "react-hot-toast";
import {boxDataUpdater} from "@/helper/helper";
export default function SignIn() {
  const [loginForm, setLoginForm] = useSignerForm();
  // const dispatch = useDispatch();
  const {selectedItems, itemsCounter, totalCount, favoriteItems} = useSelector(
    (state) => state.cart
  );
  async function signInHandler(e) {
    e.preventDefault();
    const {userNameOrEmail, password} = loginForm.signIn;
    // toast.dismiss()

    if (userNameOrEmail.length && password.length > 8) {
      // dispatch(logIn());
      // location.replace("/");
      // const data = await fetch(`/api/users/sign-in`, {
      //   method: "POST",
      //   body: JSON.stringify({...loginForm.signIn}),
      //   headers: {"Content-Type": "application/json"},
      // }).then((res) => res.json());
      // console.log(data);
      const id = toast.loading("درحال پردازش...", {
        id: "loading",
        className: "toast-alert",
      });
      const res = await signIn("credentials", {
        userNameOrEmail,
        password,
        // box: JSON.stringify({selectedItems,itemsCounter,totalCount}),
        redirect: false,
      });
      if (res.error) {
        toast.error(res.error, {
          id,
          className: "toast-alert error-toast",
        });
      } else {
        toast.success("ورود موفق ، در حال انتقال به سایت", {
          id,
          className: "toast-alert success-toast",
        });
        await boxDataUpdater(
          totalCount,
          itemsCounter,
          selectedItems,
          favoriteItems
        );
        const timer = setTimeout(() => {
          location.replace("/");
          clearTimeout(timer);
        }, 200);
      }
    } else {
      if (!userNameOrEmail.length && password.length < 8) {
        return toast.error("نام کاربری و رمز عبور نامعتبر اند!", {
          id: "toast-error",
          className: "toast-alert error-toast",
          icon: "❗❗",
        });
      } else if (!userNameOrEmail.length) {
        return toast.error("لطفا نام کاربری را وارد کنید", {
          id: "toast-error",
          className: "toast-alert error-toast",
          icon: "❗❗",
        });
      } else if (!password.length) {
        return toast.error("لطفا رمز عبور را وارد کنید", {
          id: "toast-error",
          className: "toast-alert error-toast",
          icon: "❗❗",
        });
      } else if (password.length < 8) {
        return toast.error("رمز ورود باید بیشتر از 8 حرف باشد", {
          id: "toast-error",
          className: "toast-alert error-toast",
          icon: "❗❗",
        });
      }
    }
  }
  function valueChanger(e) {
    setLoginForm({
      ...loginForm,
      signIn: {...loginForm.signIn, [`${e.target.name}`]: e.target.value},
    });
  }
  // if (userLogin) return history.back();
  return (
    <>
      <div>
        <input
          name="userNameOrEmail"
          spellCheck={false}
          className={loginForm.signIn.userNameOrEmail ? styles.fill : null}
          value={loginForm.signIn.userNameOrEmail}
          type="text"
          id="nameOrEmail"
          onChange={(e) => {
            valueChanger(e);
          }}
        />
        <label htmlFor="nameOrEmail">نام کاربری یا ایمیل</label>
      </div>
      <div>
        <input
          name="password"
          // autocomplete="off"
          className={loginForm.signIn.password ? styles.fill : null}
          value={loginForm.signIn.password}
          type="password"
          id="signInPassword"
          onChange={(e) => {
            valueChanger(e);
          }}
        />
        <label htmlFor="signInPassword">رمز عبور</label>
      </div>
      <button
        onClick={(e) => {
          signInHandler(e);
        }}>
        ورود
      </button>
    </>
  );
}

// ****************
// **** signUp ****
// ****************
export const SignUp = () => {
  const [loginForm, setLoginForm] = useSignerForm();
  async function signUpHandler(e) {
    e.preventDefault();
    const {userName, password, email, repeatPass} = loginForm.signUp;
    if (userName && password.length > 8 && email && password === repeatPass) {
      // dispatch(logIn());
      // location.replace("/");
      const id = toast.loading("در حال پردازش اطلاعات ...", {
        id: "signUpLoading",
        className: "toast-alert",
      });
      const data = await fetch(`/api/users`, {
        method: "POST",
        body: JSON.stringify({...loginForm.signUp}),
        headers: {"Content-Type": "application/json"},
      }).then((res) => res.json());
      if (!data.error) {
        const res = await signIn("credentials", {
          userNameOrEmail: userName,
          password,
          redirect: false,
        });
        if (!res.error) {
          toast.success(data.message, {
            id,
            className: "toast-alert success-toast",
            // style: {
            //   textAlign: "center"
            // },
          });
          await boxDataUpdater(
            totalCount,
            itemsCounter,
            selectedItems,
            favoriteItems
          );
          const signUpRedirect = setTimeout(() => {
            location.replace("/");
            clearTimeout(signUpRedirect);
          }, 200);
        } else {
          toast.error(res.error, {
            id,
            className: "toast-alert error-toast",
          });
        }
      } else {
        toast.error(data.error, {
          id,
          className: "toast-alert error-toast",
        });
      }
    } else {
      if (!userName || !password || !email)
        return toast.error("لطفا اطلاعات خواسته شده را با دقت وارد کنید", {
          id: "error",
          icon: "❗❗",
          className: "toast-alert error-toast",
        });
      if (password.length < 8)
        return toast.error("رمز عبور باید 8 حرف یا بیشتر داشته باشد", {
          id: "error",
          icon: "❗❗",
          className: "toast-alert error-toast",
        });
      if (password !== repeatPass)
        return toast.error("رمز عبور و تکرار آن برابر نیست!", {
          id: "error",
          icon: "❗❗",
          className: "toast-alert error-toast",
        });
    }
  }
  function valueChanger(e) {
    setLoginForm({
      ...loginForm,
      signUp: {...loginForm.signUp, [`${e.target.name}`]: e.target.value},
    });
  }
  return (
    <>
      <div className="nameField">
        <div>
          <input
            name="name"
            spellCheck={false}
            className={loginForm.signUp.name ? styles.fill : null}
            value={loginForm.signUp.name}
            type="text"
            id="name"
            onChange={(e) => {
              valueChanger(e);
            }}
          />
          <label htmlFor="name">نام</label>
        </div>
        <div>
          <input
            name="lastName"
            spellCheck={false}
            className={loginForm.signUp.lastName ? styles.fill : null}
            value={loginForm.signUp.lastName}
            type="text"
            id="lastName"
            onChange={(e) => {
              valueChanger(e);
            }}
          />
          <label htmlFor="lastName">نام خانوادگی</label>
        </div>
      </div>
      <div>
        <input
          name="userName"
          // autocomplete="off"
          className={loginForm.signUp.userName ? styles.fill : null}
          value={loginForm.signUp.userName}
          type="text"
          id="userName"
          onChange={(e) => {
            valueChanger(e);
          }}
        />
        <label htmlFor="userName">نام کاربری</label>
      </div>
      <div>
        <input
          name="email"
          // autocomplete="off"
          className={loginForm.signUp.email ? styles.fill : null}
          value={loginForm.signUp.email}
          type="text"
          id="email"
          onChange={(e) => {
            valueChanger(e);
          }}
        />
        <label htmlFor="email">ایمیل</label>
      </div>
      <div>
        <input
          name="password"
          // autocomplete="off"
          className={loginForm.signUp.password ? styles.fill : null}
          value={loginForm.signUp.password}
          type="password"
          id="signUpPassword"
          onChange={(e) => {
            valueChanger(e);
          }}
        />
        <label htmlFor="signUpPassword">رمز عبور</label>
      </div>
      <div>
        <input
          name="repeatPass"
          // autocomplete="off"
          className={loginForm.signUp.repeatPass ? styles.fill : null}
          value={loginForm.signUp.repeatPass}
          type="password"
          id="repeatPass"
          onChange={(e) => {
            valueChanger(e);
          }}
        />
        <label htmlFor="repeatPass">تکرار رمز عبور</label>
      </div>
      <button
        onClick={(e) => {
          signUpHandler(e);
        }}>
        ثبت نام
      </button>
    </>
  );
};
// **********************
// *******switcher*******
// **********************
export const Switcher = () => {
  const classChanger = () => {
    const myDiv = document.querySelector(`.${styles.orgForm}`);
    if (myDiv.className.includes(styles.signIn)) {
      myDiv.classList.remove(styles.signIn);
      myDiv.classList.add(styles.signUp);
    } else if (myDiv.className.includes(styles.signUp)) {
      myDiv.classList.remove(styles.signUp);
      myDiv.classList.add(styles.signIn);
    }
  };
  // const [loginForm, setLoginForm] = useSignerForm();
  return (
    <>
      <div className="signIn">
        <h2>حساب کاربری دارم</h2>
        <button
          onClick={() => {
            classChanger();
            // setLoginForm({...loginForm, signUp: {name: "", lastName: "", email: "", userName: "", password: ""}})
          }}>
          ورود
        </button>
      </div>
      <div className="signUp">
        <h2>حساب کاربری ندارم</h2>
        <button
          onClick={() => {
            // setLoginForm({
            //   ...loginForm,
            //   signIn: {userNameOrEmail: "", password: ""},
            // });
            classChanger();
          }}>
          ثبت نام
        </button>
      </div>
    </>
  );
};
