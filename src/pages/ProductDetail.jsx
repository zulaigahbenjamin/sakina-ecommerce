import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight, Minus, Plus, Check } from "lucide-react";
import { Image } from "@/components/ui/image";
import ProductCard from "@/components/site/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/lib/CartContext";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

const DETAILS = [
  ["Materials & craft", "materials"],
  ["Shipping & returns", null],
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: products = [], isLoading } = useProducts();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [openDetail, setOpenDetail] = useState("Materials & craft");
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.slug === slug);
  const gallery = product?.images?.length ? product.images : product ? [product.image] : [];
  const related = useMemo(
    () => products.filter((p) => p.category === product?.category && p.slug !== slug).slice(0, 3),
    [products, product, slug]
  );

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
    setAdded(false);
  }, [slug]);

  useEffect(() => {
    if (!isLoading && !product) {
      const meta = document.createElement("meta");
      meta.name = "prerender-status-code";
      meta.content = "404";
      document.head.appendChild(meta);
      return () => meta.remove();
    }
  }, [isLoading, product]);

  if (isLoading) {
    return (
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 pt-32 sm:px-8 lg:grid-cols-2">
        <div className="aspect-[4/5] animate-pulse bg-secondary" />
        <div className="space-y-4 pt-6">
          <div className="h-3 w-24 animate-pulse bg-secondary" />
          <div className="h-10 w-3/4 animate-pulse bg-secondary" />
          <div className="h-24 w-full animate-pulse bg-secondary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-4 font-display text-4xl">This piece has left the atelier</h1>
        <p className="mt-4 text-[15px] text-muted-foreground">
          The link may be old. Explore the current collection instead.
        </p>
        <Link to="/shop" className="btn-primary mt-8">Back to the collection</Link>
      </div>
    );
  }

  return (
    <div className="pt-[74px]">
      <div className="mx-auto max-w-[1500px] px-5 pt-8 sm:px-8">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={1.4} />
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground">
            {product.category}
          </Link>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-14">
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "w-16 overflow-hidden border transition-colors sm:w-20",
                  activeImage === i ? "border-foreground" : "border-transparent opacity-70 hover:opacity-100"
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={src} alt="" className="aspect-[4/5] w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden bg-secondary">
            <Image
              src={gallery[activeImage]}
              alt={product.name}
              className="aspect-[4/5] w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,3.4vw,2.9rem)] leading-[1.05]">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl">{money(product.price)}</span>
            {product.compare_at_price > product.price && (
              <span className="text-[15px] text-muted-foreground line-through">
                {money(product.compare_at_price)}
              </span>
            )}
            {product.badge && (
              <span className="ml-1 border border-accent/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-foreground">
                {product.badge}
              </span>
            )}
          </div>

          <p className="mt-6 text-[16px] leading-relaxed text-muted-foreground">
            {product.description || product.short}
          </p>

          <div className="mt-9 flex items-stretch gap-3">
            <div className="flex items-center border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-14 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" strokeWidth={1.4} />
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                className="flex h-14 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </div>
            <button
              type="button"
              disabled={product.stock === 0}
              onClick={() => {
                addItem(product, quantity);
                setAdded(true);
              }}
              className="btn-primary flex-1"
            >
              {product.stock === 0 ? "Sold out" : added ? (
                <span className="flex items-center gap-2"><Check className="h-4 w-4" strokeWidth={1.6} /> Added to bag</span>
              ) : (
                "Add to bag"
              )}
            </button>
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {product.stock > 5
              ? `In stock · ${product.stock} available`
              : product.stock > 0
              ? `Only ${product.stock} left in the atelier`
              : "Restocking soon"}
          </p>

          <div className="mt-10 border-t border-border">
            {DETAILS.map(([label, key]) => (
              <div key={label} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => setOpenDetail(openDetail === label ? "" : label)}
                  className="flex w-full items-center justify-between py-4 text-left text-[12px] uppercase tracking-[0.18em]"
                >
                  {label}
                  <Plus
                    className={cn(
                      "h-4 w-4 transition-transform duration-500",
                      openDetail === label && "rotate-45"
                    )}
                    strokeWidth={1.3}
                  />
                </button>
                {openDetail === label && (
                  <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                    {key
                      ? product[key] || "Hand-finished in the atelier."
                      : "Complimentary delivery on orders over $150. Dispatched within one working day, 3–5 days in transit. Unused pieces may be returned within 30 days."}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8">
            <p className="eyebrow">In the same collection</p>
            <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}