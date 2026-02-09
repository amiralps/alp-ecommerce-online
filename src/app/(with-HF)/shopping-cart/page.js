import {getPost} from "@/database-features/serverFunctions";
import ShoppingCartComponent from "./shopping-cart";

async function ShoppingCart() {
  const data = await getPost();
  return (
    <>
      <ShoppingCartComponent
        data={JSON.parse(JSON.stringify(data))}
      />
    </>
  );
}
export default ShoppingCart;
export const metadata = {
  title: "سبد خرید",
  description: "سبد خرید فروشگاه عینک اپتیک",
};
export const dynamic = "force-dynamic";
