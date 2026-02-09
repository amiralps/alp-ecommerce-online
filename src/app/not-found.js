import styles from "@/styles/NotFound.module.css";

function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h3>صفحه یافت نشد!</h3>
    </div>
  );
}
export default NotFound;
export const metadata = {
  title: "پیدا نشد!",
};
