import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Package } from "lucide-react";
import { Image } from "@/components/ui/image";
import { money } from "@/lib/format";

export default function OrderConfirmation() {
  const { number } = useParams();

  const order = useMemo(() => {
    try {
      const receipts = JSON.parse(localStorage.getItem("sakina_receipts") || "[]");
      return receipts.find((r) => r.order_number === number) || null;
    } catch {
      return null;
    }
  }, [number]);

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 pt-[74px] text-center">
        <Package className="h-8 w-8 text-muted-foreground" strokeWidth={1.2} />
        <h1 className="mt-6 font-display text-4xl">Receipt not found</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          We could not find this receipt on this device. Your order is still with
          us — reply to your confirmation email if you need it resent.
        </p>
        <Link to="/shop" className="btn-primary mt-9">Back to the collection</Link>
      </div>
    );
  }

  return (
    <div className="pt-[74px]">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex items-center gap-3 text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30">
            <Check className="h-4 w-4" strokeWidth={1.6} />
          </span>
          <p className="eyebrow text-primary">Order confirmed</p>
        </div>

        <h1 className="mt-6 font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.05]">
          Thank you, {order.customer_name.split(" ")[0]}
        </h1>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
          Your pieces are being wrapped by hand. A confirmation is on its way to{" "}
          <span className="text-foreground">{order.email}</span>.
        </p>

        <div className="mt-10 grid gap-6 border-y border-border py-6 sm:grid-cols-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Order</p>
            <p className="mt-2 font-mono text-sm">{order.order_number}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Payment</p>
            <p className="mt-2 text-sm capitalize">
              {order.payment_method === "cash_on_delivery" ? "Pay on delivery" : "Bank transfer"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Delivery to</p>
            <p className="mt-2 text-sm">
              {order.city}, {order.country}
            </p>
          </div>
        </div>

        <ul className="mt-8 space-y-5">
          {(order.items || []).map((item) => (
            <li key={item.slug} className="flex items-center gap-4">
              <div className="w-16 shrink-0 overflow-hidden bg-secondary">
                <Image src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[15px]">{item.name}</p>
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Qty {item.quantity}
                </p>
              </div>
              <span className="text-[14px]">{money(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-8 space-y-3 border-t border-border pt-6 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{money(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{order.shipping_fee === 0 ? "Complimentary" : money(order.shipping_fee)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-4">
            <dt>Total</dt>
            <dd className="font-display text-2xl">{money(order.total)}</dd>
          </div>
        </dl>

        {order.payment_method === "bank_transfer" && (
          <p className="mt-8 border border-border bg-secondary/40 px-5 py-4 text-[13px] leading-relaxed text-muted-foreground">
            Bank transfer details will be sent to your email. Your order ships as
            soon as the transfer clears.
          </p>
        )}

        <Link to="/shop" className="btn-outline mt-10">Continue browsing</Link>
      </div>
    </div>
  );
}