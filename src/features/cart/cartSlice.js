import {createSlice} from "@reduxjs/toolkit";

// const oldStore = JSON.parse(localStorage.getItem("productsState"));
const initialState = {
  itemsCounter: 0,
  selectedItems: [],
  totalCount: 0,
  favoriteItems: [],
  checkOut: false,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItem(state, action) {
      const {colorIndex, data} = action.payload;
      const productIndex = state.selectedItems.findIndex(
        (item) => item._id == data._id
      );
      // console.log(colors);
      if (state.selectedItems.find((item) => item._id == data._id)) {
        state.selectedItems = state.selectedItems.map((item) => {
          if (item._id === data._id) {
            delete item.colors[colorIndex].quantity;

            state.itemsCounter -= 1;
            state.totalCount -= data.colors[colorIndex].price;
          }
          return item;
        });
        const quantityStatus = state.selectedItems[productIndex].colors.every(
          (item) => {
            return !item.quantity;
          }
        );
        if (quantityStatus) {
          state.selectedItems = state.selectedItems.filter(
            (item) => item._id !== data._id
          );
        }
      }
      if (!state.selectedItems.length && !state.favoriteItems.length) {
        localStorage.removeItem("productsState");
      } else {
        localStorage.setItem("productsState", JSON.stringify(state));
      }
    },
    addItem(state, action) {
      const {colorIndex, data} = action.payload;
      const productIndex = state.selectedItems.findIndex((item) => {
        return item._id === data._id;
      });
      if (productIndex === -1) {
        state.selectedItems.push({
          ...data,
          colors: data.colors.map((c, i) => {
            if (i === colorIndex) {
              return {...c, quantity: 1};
            }
            return {...c};
          }),
        });
        state.itemsCounter += 1;
        state.totalCount += data.colors[colorIndex].price;
      } else {
        state.selectedItems[productIndex].colors[colorIndex].quantity = 1;
        state.itemsCounter += 1;
        state.totalCount += data.colors[colorIndex].price;
      }
      localStorage.setItem("productsState", JSON.stringify(state));
    },
    increment(state, action) {
      const {colorIndex, data} = action.payload;
      const productIndex = state.selectedItems.findIndex((item) => {
        return item._id === data._id;
      });
      if (
        state.selectedItems[productIndex].colors[colorIndex].quantity <
        state.selectedItems[productIndex].colors[colorIndex].inventory
      ) {
        state.selectedItems[productIndex].colors[colorIndex].quantity += 1;
        state.itemsCounter += 1;
        state.totalCount += data.colors[colorIndex].price;
      }
      localStorage.setItem("productsState", JSON.stringify(state));
    },
    decrement(state, action) {
      const {colorIndex, data} = action.payload;
      const productIndex = state.selectedItems.findIndex((item) => {
        return item._id === data._id;
      });
      if (
        state?.selectedItems[productIndex]?.colors[colorIndex]?.quantity > 1
      ) {
        state.selectedItems[productIndex].colors[colorIndex].quantity -= 1;
        state.itemsCounter -= 1;
        state.totalCount -= data.colors[colorIndex].price;
      }
      localStorage.setItem("productsState", JSON.stringify(state));
    },
    favorite(state, action) {
      const data = action.payload;
      if (!state.favoriteItems.find((item) => item._id === data._id)) {
        state.favoriteItems.push(data);
      } else {
        state.favoriteItems = state.favoriteItems.filter(
          (item) => item._id !== data._id
        );
      }
      if (!state.favoriteItems.length && !state.selectedItems.length) {
        localStorage.removeItem("productsState");
      } else {
        localStorage.setItem("productsState", JSON.stringify(state));
      }
    },
    checkOut(state) {
      state.itemsCounter = 0;
      state.selectedItems = [];
      state.totalCount = 0;
      state.checkOut = false;
      if (!state.favoriteItems.length) {
        localStorage.removeItem("productsState");
      } else {
        localStorage.setItem("productsState", JSON.stringify(state));
      }
    },
    setBoxStorage(state, action) {
      return state = {...action.payload}
    },
  },
});

export default cartSlice.reducer;
export const {removeItem, addItem, increment, decrement, favorite, checkOut, setBoxStorage} =
  cartSlice.actions;
