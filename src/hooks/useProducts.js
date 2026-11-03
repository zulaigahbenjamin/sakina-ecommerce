import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const page = await base44.entities.Product.filter(
        { active: true },
        { sort: "sort_order", limit: 200 }
      );
      return page.items ?? [];
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["products-all"],
    queryFn: async () => {
      const page = await base44.entities.Product.filter({}, { sort: "sort_order", limit: 200 });
      return page.items ?? [];
    },
  });
}