"use client";

import {Provider as ReduxProvider} from "react-redux";
import store from "../store/store.js";
import {useEffect} from "react";
import BoxReader from "@/components/boxReader.js";
import {SessionProvider} from "next-auth/react";

function Provider({children}) {
  useEffect(() => {
    window.scrollTo({top: 0})
  }, []);
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <BoxReader />
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
export default Provider;
