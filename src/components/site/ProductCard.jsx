import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { money } from "@/lib/format";
import { useCart } from "@/lib/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <article className="group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-secondary">
          <Image
            src={product.image}
            alt={product.name}
            className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]"
          />
          {product.badge && (
            <span className="absolute left-4 top-4 bg-background/90 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-foreground backdrop-blur">
              {product.badge}
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-background/70 text-[11px] uppercase tracking-[0.28em]">
              Sold out
            </span>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            {product.category}
          </p>
          <h3 className="mt-2 font-display text-[21px] leading-snug">
            <Link to={`/product/${product.slug}`} className="link-line">
              {product.name}
            </Link>
          </h3>
          <p className="mt-2 flex items-baseline gap-2 text-[15px]">
            <span>{money(product.price)}</span>
            {product.compare_at_price > product.price && (
              <span className="text-[13px] text-muted-foreground line-through">
                {money(product.compare_at_price)}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          disabled={product.stock === 0}
          onClick={() => addItem(product)}
          className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center border border-border transition-colors duration-500 hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-30"
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus className="h-4 w-4" strokeWidth={1.4} />
        </button>
      </div>
    </article>
  );
}