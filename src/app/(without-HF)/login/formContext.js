"use client";
import {createContext, useContext, useState} from "react";

export const formContext = createContext();
function FormContext({children}) {
  const [inputs, setInputs] = useState({
    signIn: {userNameOrEmail: "", password: ""},
    signUp: {name: "", lastName: "", email: "", userName: "", password: "",repeatPass: ""},
  });

  return (
    <formContext.Provider value={[inputs, setInputs]}>
      {children}
    </formContext.Provider>
  );
}
export default FormContext;

export const useSignerForm = () => {
  const [forms, setForms] = useContext(formContext);
  return [forms, setForms];
};
