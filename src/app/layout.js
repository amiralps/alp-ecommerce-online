// import { Geist, Geist_Mono } from
// "next/font/google";
import "@/styles/styles.css";
import Providers from "./Provider";
// import {Suspense} from "react";
import {Toaster} from "react-hot-toast";
import ShoppingCartContext from "@/context/shopContext";
// import Loading from "@/components/Loading";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata = {
  icons: {icon: "/policy-sunglasses.svg"},
};
export default function RootLayout({children}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {const saved = localStorage.getItem("theme");const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;if (saved === "Dark" || (!saved && prefersDark)) {document.documentElement.classList.add("Dark");localStorage.setItem("theme", "Dark");}const setTheme = setTimeout(() => {document.documentElement.style.transition = "0.4s background-color";clearTimeout(setTheme);}, 300);})()`,
          }}></script>
      </head>
      <body>
        <Providers>
          <ShoppingCartContext>
            <main className="main">
              {/* <Suspense fallback={<Loading />}> */}
              {children}
              {/* </Suspense> */}
            </main>
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  fontFamily: "tanha, serif",
                },
              }}
            />
          </ShoppingCartContext>
        </Providers>
      </body>
    </html>
  );
}
