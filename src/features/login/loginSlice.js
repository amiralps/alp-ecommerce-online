import {createSlice} from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {userLogin: false},
  reducers: {
    logIn(state) {
      localStorage.setItem(
        "userLogin",
        true
      );
      state.userLogin = true;
    },
    logOut(state) {
      localStorage.removeItem("userLogin");
      state.userLogin = false;
    },
  },
});

export default loginSlice.reducer;
export const {logIn, logOut} = loginSlice.actions;
