export const getCartsLocalStorage = () => {
  const cartStr = localStorage.getItem("carts");
  if (!cartStr) return [];
  return JSON.parse(cartStr);
};

export const deleteBookLocalStorage = (bookId: string) => {
  const cartStr = localStorage.getItem("carts");

  if (!cartStr) return [];

  const carts: ICartData[] = JSON.parse(cartStr);

  const newCarts = carts.filter((item) => item._id !== bookId);

  localStorage.setItem("carts", JSON.stringify(newCarts));

  return newCarts;
};

export const saveBookLocalStorage = (
  bookData: IBookTable,
  quantity: number
) => {
  const cartStr = localStorage.getItem("carts");

  if (!cartStr) {
    const cartData: ICartData = {
      detail: bookData,
      quantity: quantity,
      _id: bookData._id,
    };

    const carts: string = JSON.stringify([cartData]);

    localStorage.setItem("carts", carts);
    return [cartData];
  } else {
    const carts: ICartData[] = JSON.parse(cartStr);

    const index = carts.findIndex((item) => item._id === bookData._id);

    if (index === -1) {
      const cartData: ICartData = {
        detail: bookData,
        quantity: quantity,
        _id: bookData._id,
      };
      carts.push(cartData);
    } else {
      carts[index].quantity = quantity;
    }

    localStorage.setItem("carts", JSON.stringify(carts));
    return carts;
  }
};
