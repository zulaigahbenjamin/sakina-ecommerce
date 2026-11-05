import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { money } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUSES = ["pending", "paid", "packed", "shipped", "delivered", "cancelled"];

const STATUS_STYLE = {
  pending: "text-amber-300/80",
  paid: "text-emerald-300/80",
  packed: "text-sky-300/80",
  shipped: "text-indigo-300/80",
  delivered: "text-white/45",
  cancelled: "text-red-300/70",
};

export default function AdminOrders({ orders, loading }) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const setStatus = async (order, status) => {
    setSavingId(order.id);
    try {
      await base44.entities.Order.update(order.id, {
        status,
        payment_status:
          status === "paid" || status === "delivered" ? "paid" : order.payment_status,
      });
      refresh();
      if (selected?.id === order.id) setSelected({ ...order, status });
    } finally {
      setSavingId(null);
    }
  };

  const setTracking = async (order, tracking_number) => {
    await base44.entities.Order.update(order.id, { tracking_number });
    refresh();
  };

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <header className="border-b border-white/10 pb-8">
        <p className="text-[10px] uppercase tracking-[0.26em] text-white/35">Fulfilment</p>
        <h1 className="mt-3 font-display text-4xl">Orders</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors ${
                filter === status
                  ? "border-white/50 text-white"
                  : "border-white/10 text-white/35 hover:text-white/70"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <p className="py-16 text-[14px] text-white/40">Loading orders…</p>
      ) : visible.length === 0 ? (
        <p className="py-16 text-[14px] text-white/40">No orders in this view yet.</p>
      ) : (
        <ul className="divide-y divide-white/[0.07]">
          {visible.map((order) => (
            <li key={order.id} className="flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:justify-between">
              <button
                type="button"
                onClick={() => setSelected(order)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-[15px]">{order.customer_name}</p>
                <p className="mt-1 font-mono text-[11px] text-white/35">
                  {order.order_number} · {new Date(order.created_date).toLocaleDateString()} ·{" "}
                  {(order.items || []).length} item{(order.items || []).length === 1 ? "" : "s"}
                </p>
              </button>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[14px]">{money(order.total)}</span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                  {order.payment_method === "cash_on_delivery" ? "On delivery" : "Transfer"}
                </span>
                <select
                  value={order.status}
                  disabled={savingId === order.id}
                  onChange={(e) => setStatus(order, e.target.value)}
                  className={`border border-white/15 bg-[#0B0F0E] px-3 py-2 text-[10px] uppercase tracking-[0.16em] ${STATUS_STYLE[order.status] || "text-white/60"}`}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status} className="bg-[#0B0F0E] text-white">
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto border-white/10 bg-[#0F1413] text-[#FBFAF7]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-light">
              {selected?.order_number}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 text-[14px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Customer</p>
                  <p className="mt-1">{selected.customer_name}</p>
                  <p className="text-white/55">{selected.email}</p>
                  <p className="text-white/55">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Delivery</p>
                  <p className="mt-1 leading-relaxed text-white/55">
                    {selected.address}
                    <br />
                    {selected.city} {selected.postal_code}
                    <br />
                    {selected.country}
                  </p>
                </div>
              </div>

              {selected.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">Gift note</p>
                  <p className="mt-1 text-white/55">{selected.notes}</p>
                </div>
              )}

              <ul className="divide-y divide-white/[0.07] border-y border-white/10">
                {(selected.items || []).map((item) => (
                  <li key={item.slug} className="flex items-center justify-between gap-4 py-3">
                    <span>
                      {item.name}
                      <span className="ml-2 text-[11px] text-white/35">× {item.quantity}</span>
                    </span>
                    <span>{money(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-[15px]">
                <span className="text-white/45">Total</span>
                <span className="font-display text-2xl">{money(selected.total)}</span>
              </div>

              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Tracking number
                </span>
                <input
                  defaultValue={selected.tracking_number || ""}
                  onBlur={(e) => setTracking(selected, e.target.value)}
                  placeholder="Add when dispatched"
                  className="mt-1 w-full border border-white/15 bg-transparent px-3 py-2.5 text-[14px] placeholder:text-white/25 focus:border-white/50 focus:outline-none"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {STATUSES.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(selected, status)}
                    className={`border px-3 py-2 text-[9px] uppercase tracking-[0.18em] transition-colors ${
                      selected.status === status
                        ? "border-white/50 text-white"
                        : "border-white/10 text-white/40 hover:text-white/80"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}