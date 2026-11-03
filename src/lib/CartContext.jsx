import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sakina_cart_v1";
const CartContext = createContext(null);

const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(read);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const api = useMemo(
    () => ({
      items,
      addItem(product, quantity = 1) {
        setItems((prev) => {
          const existing = prev.find((i) => i.slug === product.slug);
          if (existing) {
            return prev.map((i) =>
              i.slug === product.slug
                ? { ...i, quantity: Math.min(i.quantity + quantity, 20) }
                : i
            );
          }
          return [
            ...prev,
            {
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
              quantity,
            },
          ];
        });
      },
      setQuantity(slug, quantity) {
        setItems((prev) =>
          prev.map((i) =>
            i.slug === slug ? { ...i, quantity: Math.max(1, Math.min(quantity, 20)) } : i
          )
        );
      },
      removeItem(slug) {
        setItems((prev) => prev.filter((i) => i.slug !== slug));
      },
      clear() {
        setItems([]);
      },
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    [items]
  );

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}