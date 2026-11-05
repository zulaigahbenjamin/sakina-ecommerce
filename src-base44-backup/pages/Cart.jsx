import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/CartContext";
import { money } from "@/lib/format";
import { shippingFor, FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";

export default function Cart() {
  const { items, setQuantity, removeItem, subtotal, count } = useCart();
  const shipping = shippingFor(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 pt-[74px] text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="mt-5 font-display text-4xl">Nothing gathered yet</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Your bag is empty. The atelier is open — begin with the pieces most
          kept this season.
        </p>
        <Link to="/shop" className="btn-primary mt-9">
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[74px]">
      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:py-20">
        <p className="eyebrow">Your bag · {count} item{count === 1 ? "" : "s"}</p>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)]">The gathering</h1>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            {remaining > 0 && (
              <p className="mb-6 border border-border bg-secondary/50 px-5 py-3 text-[12px] uppercase tracking-[0.16em] text-muted-foreground">
                {money(remaining)} away from complimentary delivery
              </p>
            )}

            <ul className="border-t border-border">
              {items.map((item) => (
                <li key={item.slug} className="flex gap-5 border-b border-border py-6">
                  <Link to={`/product/${item.slug}`} className="w-24 shrink-0 overflow-hidden bg-secondary sm:w-28">
                    <Image src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                          {item.category}
                        </p>
                        <h2 className="mt-2 font-display text-xl leading-snug">
                          <Link to={`/product/${item.slug}`} className="link-line">
                            {item.name}
                          </Link>
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-4 w-4" strokeWidth={1.3} />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.slug, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.4} />
                        </button>
                        <span className="w-7 text-center text-[13px]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.slug, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.4} />
                        </button>
                      </div>
                      <span className="text-[15px]">{money(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/shop" className="link-line mt-8 inline-block text-[11px] uppercase tracking-[0.22em]">
              Continue browsing
            </Link>
          </div>

          <aside className="h-fit border border-border p-7 lg:sticky lg:top-24">
            <p className="eyebrow">Order summary</p>
            <dl className="mt-6 space-y-3 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{shipping === 0 ? "Complimentary" : money(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-lg">
                <dt>Total</dt>
                <dd className="font-display text-2xl">{money(subtotal + shipping)}</dd>
              </div>
            </dl>

            <Link to="/checkout" className="btn-primary group mt-7 w-full">
              Checkout
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-muted-foreground">
              Wrapped by hand · Secure checkout · 30-day returns
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}