import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, LayoutGrid } from "lucide-react";
import ProductCard from "@/components/site/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

const SORTS = [
  { key: "featured", label: "Curated" },
  { key: "price-asc", label: "Price ↑" },
  { key: "price-desc", label: "Price ↓" },
  { key: "new", label: "Newest" },
];

export default function Shop() {
  const { data: products = [], isLoading } = useProducts();
  const [params, setParams] = useSearchParams();
  const active = params.get("category") || "All";
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const visible = useMemo(() => {
    let list = [...products];
    if (active !== "All") list = list.filter((p) => p.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.short?.toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "new") list.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    return list;
  }, [products, active, sort, query]);

  return (
    <div className="pt-[74px]">
      <header className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:py-24">
          <p className="eyebrow">The collection</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="max-w-xl font-display text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.02]">
              Every piece, made slowly
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              {visible.length} piece{visible.length === 1 ? "" : "s"} in the atelier right now.
              Hand-finished, wrapped in recycled tissue, shipped worldwide.
            </p>
          </div>
        </div>
      </header>

      <div className="sticky top-[74px] z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setParams(category === "All" ? {} : { category })
                }
                className={cn(
                  "shrink-0 border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300",
                  active === category
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-0 h-4 w-4 text-muted-foreground" strokeWidth={1.4} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the atelier"
                aria-label="Search products"
                className="w-40 border-b border-transparent bg-transparent py-2 pl-7 text-[13px] placeholder:text-muted-foreground focus:border-foreground focus:outline-none sm:w-56"
              />
            </div>
            <div className="flex items-center gap-1 border-l border-border pl-4">
              <LayoutGrid className="mr-1 h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.4} />
              {SORTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSort(option.key)}
                  className={cn(
                    "px-2 py-1 text-[10px] uppercase tracking-[0.16em] transition-colors",
                    sort === option.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:py-20">
        {isLoading ? (
          <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] w-full bg-secondary" />
                <div className="mt-4 h-3 w-24 bg-secondary" />
                <div className="mt-3 h-4 w-48 bg-secondary" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Nothing here yet</p>
            <p className="mx-auto mt-3 max-w-sm text-[15px] text-muted-foreground">
              This shelf is being restocked. Try another collection, or{" "}
              <Link to="/shop" className="underline underline-offset-4">see everything</Link>.
            </p>
          </div>
        ) : (
          <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}