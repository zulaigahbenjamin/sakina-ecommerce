import { money } from "@/lib/format";

const STATUS_STYLE = {
  pending: "text-amber-300/80",
  paid: "text-emerald-300/80",
  packed: "text-sky-300/80",
  shipped: "text-indigo-300/80",
  delivered: "text-white/40",
  cancelled: "text-red-300/70",
};

export default function AdminOverview({ stats, orders, products, loading, onSeeOrders }) {
  const lowStock = products.filter((p) => (p.stock ?? 0) <= 5);
  const recent = orders.slice(0, 6);

  const cards = [
    { label: "Revenue", value: money(stats.revenue) },
    { label: "Orders", value: stats.orders },
    { label: "Awaiting action", value: stats.pending },
    { label: "Pieces sold", value: stats.units },
  ];

  return (
    <div>
      <header className="border-b border-white/10 pb-8">
        <p className="text-[10px] uppercase tracking-[0.26em] text-white/35">Today at the house</p>
        <h1 className="mt-3 font-display text-4xl">A quiet ledger</h1>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-white/10 bg-white/[0.02] p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">{card.label}</p>
            <p className="mt-3 font-display text-3xl">{loading ? "—" : card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-white/60">Recent orders</h2>
            <button
              type="button"
              onClick={onSeeOrders}
              className="text-[10px] uppercase tracking-[0.2em] text-white/35 hover:text-white"
            >
              All orders
            </button>
          </div>

          {recent.length === 0 ? (
            <p className="py-10 text-[14px] text-white/40">
              No orders yet. They appear here the moment a customer checks out.
            </p>
          ) : (
            <ul className="divide-y divide-white/[0.07]">
              {recent.map((order) => (
                <li key={order.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-[14px]">{order.customer_name}</p>
                    <p className="mt-1 font-mono text-[11px] text-white/35">
                      {order.order_number} · {new Date(order.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className={`text-[10px] uppercase tracking-[0.18em] ${STATUS_STYLE[order.status] || "text-white/40"}`}>
                      {order.status}
                    </span>
                    <span className="text-[14px]">{money(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="border-b border-white/10 pb-4 text-[11px] uppercase tracking-[0.2em] text-white/60">
            Low stock
          </h2>
          {lowStock.length === 0 ? (
            <p className="py-10 text-[14px] text-white/40">Every piece is comfortably stocked.</p>
          ) : (
            <ul className="divide-y divide-white/[0.07]">
              {lowStock.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-4 py-4">
                  <span className="truncate text-[14px]">{product.name}</span>
                  <span className="text-[12px] text-amber-300/80">{product.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}