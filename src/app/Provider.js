"use client";

import {Provider as ReduxProvider} from "react-redux";
import store from "../store/store.js";
import {useEffect} from "react";
import {handleTheme} from "@/helper/theme-handler.js";
import BoxReader from "@/components/boxReader.js";
import {SessionProvider} from "next-auth/react";

function Provider({children}) {
  useEffect(() => {
    handleTheme();
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
