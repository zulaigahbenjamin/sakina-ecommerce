export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_FEE = 18;

export const shippingFor = (subtotal) =>
  subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;

export const totalFor = (subtotal) => subtotal + shippingFor(subtotal);