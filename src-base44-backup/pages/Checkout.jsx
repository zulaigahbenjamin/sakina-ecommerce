import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/CartContext";
import { money, orderNumber } from "@/lib/format";
import { shippingFor } from "@/lib/shipping";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = [
  {
    key: "cash_on_delivery",
    label: "Pay on delivery",
    hint: "Cash or card at your door. Available in the UAE and GCC.",
  },
  {
    key: "bank_transfer",
    label: "Bank transfer",
    hint: "We send transfer details with your confirmation.",
  },
];

const FIELDS = [
  { name: "customer_name", label: "Full name", type: "text", required: true, half: false },
  { name: "email", label: "Email", type: "email", required: true, half: true },
  { name: "phone", label: "Phone", type: "tel", required: true, half: true },
  { name: "address", label: "Address", type: "text", required: true, half: false },
  { name: "city", label: "City", type: "text", required: true, half: true },
  { name: "country", label: "Country", type: "text", required: true, half: true },
  { name: "postal_code", label: "Postal code", type: "text", required: false, half: true },
  { name: "notes", label: "Gift note (optional)", type: "text", required: false, half: false },
];

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [payment, setPayment] = useState("cash_on_delivery");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 pt-[74px] text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <Link to="/shop" className="btn-primary mt-8">Explore the collection</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const missing = FIELDS.filter((f) => f.required && !form[f.name]?.trim());
    if (missing.length) {
      setError(`Please complete: ${missing.map((f) => f.label).join(", ")}.`);
      return;
    }

    setSaving(true);
    try {
      const number = orderNumber();
      const order = await base44.entities.Order.create({
        order_number: number,
        customer_name: form.customer_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        postal_code: form.postal_code?.trim() || "",
        notes: form.notes?.trim() || "",
        items: items.map((i) => ({
          slug: i.slug,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        subtotal,
        shipping_fee: shipping,
        total,
        status: "pending",
        payment_method: payment,
        payment_status: "unpaid",
      });

      const receipts = JSON.parse(localStorage.getItem("sakina_receipts") || "[]");
      localStorage.setItem(
        "sakina_receipts",
        JSON.stringify([order, ...receipts].slice(0, 20))
      );
      clear();
      navigate(`/order/${order.order_number}`);
    } catch (err) {
      setError("We could not place your order just now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-[74px]">
      <div className="mx-auto max-w-[1500px] px-5 py-14 sm:px-8 lg:py-20">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.4rem)]">Finish your order</h1>

        <form onSubmit={submit} className="mt-12 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div>
            <section>
              <h2 className="font-display text-2xl">Delivery details</h2>
              <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {FIELDS.map((field) => (
                  <label
                    key={field.name}
                    className={cn("block", field.half ? "" : "sm:col-span-2")}
                  >
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {field.label}
                    </span>
                    <input
                      type={field.type}
                      required={field.required}
                      value={form[field.name] || ""}
                      onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                      className="lux-input mt-1"
                      autoComplete={field.name === "customer_name" ? "name" : field.name}
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="mt-14">
              <h2 className="font-display text-2xl">Payment</h2>
              <div className="mt-6 space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() => setPayment(method.key)}
                    className={cn(
                      "flex w-full items-start gap-4 border p-5 text-left transition-colors duration-300",
                      payment === method.key
                        ? "border-foreground bg-secondary/40"
                        : "border-border hover:border-foreground/40"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                        payment === method.key ? "border-foreground" : "border-input"
                      )}
                    >
                      {payment === method.key && <span className="h-2 w-2 rounded-full bg-foreground" />}
                    </span>
                    <span>
                      <span className="block text-[14px] uppercase tracking-[0.14em]">{method.label}</span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">
                        {method.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-5 flex items-start gap-2 text-[12px] leading-relaxed text-muted-foreground">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.4} />
                Your details are used only to deliver this order. No card details are stored.
              </p>
            </section>

            {error && (
              <p className="mt-8 border border-destructive/40 bg-destructive/5 px-5 py-3 text-[13px] text-destructive">
                {error}
              </p>
            )}

            <button type="submit" disabled={saving} className="btn-primary mt-9 w-full sm:w-auto">
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Placing order
                </span>
              ) : (
                `Place order · ${money(total)}`
              )}
            </button>
          </div>

          <aside className="h-fit border border-border p-7 lg:sticky lg:top-24">
            <p className="eyebrow">In your bag</p>
            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li key={item.slug} className="flex items-center gap-4">
                  <div className="w-14 shrink-0 overflow-hidden bg-secondary">
                    <Image src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] leading-snug">{item.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-[13px]">{money(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-7 space-y-3 border-t border-border pt-5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{shipping === 0 ? "Complimentary" : money(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <dt>Total</dt>
                <dd className="font-display text-2xl">{money(total)}</dd>
              </div>
            </dl>
          </aside>
        </form>
      </div>
    </div>
  );
}