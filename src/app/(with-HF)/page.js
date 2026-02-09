import MySunglasses from "@/svg/MySunglasses";
import styles from "@/styles/Home.module.css";
function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.svg}>
        <MySunglasses
          data={{
            duration: "8s",
            fill: "forwards",
            count: "infinite",
            ease: "linear",
            strokeWidth: "6",
          }}
        />
      </div>
      <div className={styles.text}>
        <h1>عینک اُپتیک</h1>
        <div className={styles.items}>
          <div>
            <span>زیبا</span>
            <span>مقاوم</span>
            <span>به صرفه</span>
            <span>زیبا</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
export const metadata = {
  title: "عینک اپتیک",
}