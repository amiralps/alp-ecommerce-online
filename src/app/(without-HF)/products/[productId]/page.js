import styles from "@/styles/ProductsDetail.module.css";
import ProductsDetailComponent from "./products-detail";
import {getPost} from "@/database-features/serverFunctions";
import {notFound} from "next/navigation";

// export const dynamic = "force-static"
// export const dynamicParams = true;
export async function generateStaticParams() {
  const data = await getPost();
  if (!data) return [];
  const paramData = data.map((i) => ({productId: String(i._id)}));
  return paramData;
}
export default async function ProductsDetail(props) {
  const {productId} = await props.params;

  const data = await getPost(productId);
  if (!data) {
    return notFound();
  }
  return (
    <div className={styles.productDAS}>
      <ProductsDetailComponent
        data={JSON.parse(JSON.stringify(data))}
      />
    </div>
  );
}

export const generateMetadata = async (props) => {
  const {productId} = await props.params;
  const product = await getPost(productId);
  if (product) {
    return {title: `${product.title}`, description: `${product.description}`};
  }
  return notFound()
};
