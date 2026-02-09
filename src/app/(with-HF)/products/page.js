import styles from "@/styles/Products.module.css";
import Card from "@/components/Card.js";
import { getPost } from "@/database-features/serverFunctions";

async function ProductsPage() {
  const data = await getPost()
  return (
    <ul className={styles.products}>
      {data.map((item) => (
        <Card key={item.id} data={JSON.parse(JSON.stringify(item))} />
      ))}
    </ul>
  );
}
export default ProductsPage;
export const metadata = {
  title: "محصولات",
  description: "products page",
};
