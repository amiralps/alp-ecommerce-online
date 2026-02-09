export const changeTitle = (str = "") => {
  document.title = str;
};

export const priceFormat = (price = "1") => {
  return `${price}000`
    .split("")
    .reverse()
    .join("")
    .match(/.{1,3}/g)
    .reverse()
    .map((i) => i.split("").reverse().join(""))
    .join(",");
};

export const resizer = (width, maxWidth = 900) => {
  let result = width <= maxWidth;
  return result;
};

export const boxDataUpdater = async (totalPrice, totalCounts, selectedItems) => {
  const boxData = {
    totalPrice,
    totalCounts,
    items: selectedItems.map((item) => ({
      product: item._id,
      colors: item.colors
        .filter((c) => !!c.quantity)
        .map((c) => {
          return {color: c.color, quantity: c.quantity};
        }),
    })),
  };
  const data = await fetch("/api/carts", {
    method: "PUT",
    body: JSON.stringify(boxData),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.json())
  return data
};
