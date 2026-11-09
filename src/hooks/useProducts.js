
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/api/products");

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      return data.products ?? [];
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["products-all"],
    queryFn: async () => {
      const page = await base44.entities.Product.filter(
        {},
        { sort: "sort_order", limit: 200 }
      );

      return page.items ?? [];
    },
  });
}
