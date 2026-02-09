import {useRef} from "react";
import styles from "../styles/LogOutAlert.module.css";
import { signOut } from "next-auth/react";
function LogOutAlert({data: {alert, setAlert, /*dispatch,  logOut, */ enableScroll, scrollTop}}) {
  const alertDiv = useRef(null);
  return (
    <>
      <div
        ref={alertDiv}
        className={`${styles.alert} ${alert === "on" ? styles.on : ""}`}>
        <h3>مطمئن هستید که از حسابتان خارج می شوید؟</h3>
        <div className={styles.buttons}>
          <button
            onClick={() => {
              // dispatch(logOut());
              signOut()
              setAlert("off");
              enableScroll()
              scrollTop()
            }}>
            بله
          </button>
          <button
            onClick={() => {
              setAlert("off");
              enableScroll()
            }}>
            انصراف
          </button>
        </div>
      </div>
      <div
        className={styles.backDiv}
        onClick={() => {
          setAlert("off");
          enableScroll()
          //   alertDiv.current.classList.remove("on");
        }}></div>
    </>
  );
}
export default LogOutAlert;
