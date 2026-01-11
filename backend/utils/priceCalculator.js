exports.isDiscountValid = (product) => {
  if (!product.isDiscountActive) return false;

  const now = new Date();

  if (product.discountStartDate && now < product.discountStartDate) return false;
  if (product.discountEndDate && now > product.discountEndDate) return false;

  return true;
};

exports.getFinalPrice = (price, product) => {
  if (!exports.isDiscountValid(product)) return price;

  return Math.round(price - (price * product.discount) / 100);
};
