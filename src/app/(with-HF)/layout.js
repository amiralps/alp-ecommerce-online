import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HFLayOut({children}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
