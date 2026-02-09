import SignIn, {SignUp, Switcher} from "./login";
import styles from "@/styles/Login.module.css";
import FormContext from "./formContext";
import { redirect } from "next/navigation";
import { getToken } from "@/database-features/serverFunctions";

export default async function LoginPage() {
  const session = await getToken()
  if (session) redirect("/")
  return (
    <>
      <FormContext>
        <main className={styles.main}>
          <div className={styles.myForm}>
            <div className={`${styles.orgForm} ${styles.signIn}`}>
              <form className={styles.signUpForm}>
                <h1>فرم ثبت نام</h1>
                <SignUp />
              </form>
              <form className={styles.signInForm}>
                <h1>فرم ورود</h1>
                <SignIn />
              </form>

              <div className={styles.switcher}>
                <div>
                  <Switcher />
                </div>
              </div>
            </div>
            <div className={styles.border}></div>
          </div>
        </main>
      </FormContext>
    </>
  );
}
export const metadata = {
  title: "ورود به حساب کاربری",
};
