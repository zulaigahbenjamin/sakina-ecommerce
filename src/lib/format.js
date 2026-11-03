export const money = (value) => {
  const n = Number(value) || 0;
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};

export const orderNumber = () =>
  `SK-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 9)}`;