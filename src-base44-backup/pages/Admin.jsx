import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LayoutDashboard, Package, ShoppingBag, ArrowUpRight, LogIn } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/site/Logo";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "products", label: "Products", icon: Package },
];

export default function Admin() {
  const [tab, setTab] = useState("overview");

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
  });

  const isAdmin = user?.role === "admin";

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ["admin-orders"],
    enabled: isAdmin,
    queryFn: async () => {
      const page = await base44.entities.Order.filter({}, { sort: "-created_date", limit: 200 });
      return page.items ?? [];
    },
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products-all"],
    enabled: isAdmin,
    queryFn: async () => {
      const page = await base44.entities.Product.filter({}, { sort: "sort_order", limit: 200 });
      return page.items ?? [];
    },
  });

  const stats = useMemo(() => {
    const live = orders.filter((o) => o.status !== "cancelled");
    const revenue = live.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      revenue,
      orders: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      units: live.reduce(
        (sum, o) => sum + (o.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
        0
      ),
    };
  }, [orders]);

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0F0E]">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0F0E] px-6 text-center text-[#FBFAF7]">
        <Logo className="[&_*]:!text-[#FBFAF7]" />
        <h1 className="mt-10 font-display text-4xl">Atelier access</h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/50">
          This dashboard is reserved for the house owner. Sign in with the owner
          account to manage products and orders.
        </p>
        {user ? (
          <p className="mt-8 border border-white/15 px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-white/50">
            Signed in as {user.email} — not an owner account
          </p>
        ) : (
          <button
            type="button"
            onClick={() => base44.auth.redirectToLogin("/admin")}
            className="mt-8 inline-flex items-center gap-2 bg-[#FBFAF7] px-7 py-4 text-[11px] uppercase tracking-[0.22em] text-[#0B0F0E]"
          >
            <LogIn className="h-4 w-4" strokeWidth={1.5} /> Sign in
          </button>
        )}
        <Link to="/" className="mt-8 text-[11px] uppercase tracking-[0.22em] text-white/40 hover:text-white">
          Back to the store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-[#FBFAF7]">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:gap-14 lg:py-12">
        <aside className="lg:w-56 lg:shrink-0">
          <Logo className="[&_*]:!text-[#FBFAF7]" />
          <p className="mt-4 text-[10px] uppercase tracking-[0.26em] text-white/35">
            Atelier dashboard
          </p>

          <nav className="mt-10 flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex shrink-0 items-center gap-3 px-3 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  tab === key
                    ? "bg-white/10 text-[#FBFAF7]"
                    : "text-white/45 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.4} />
                {label}
              </button>
            ))}
          </nav>

          <Link
            to="/"
            className="mt-10 hidden items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/35 hover:text-white lg:flex"
          >
            View store <ArrowUpRight className="h-3 w-3" strokeWidth={1.4} />
          </Link>
        </aside>

        <main className="min-w-0 flex-1">
          {tab === "overview" && (
            <AdminOverview
              stats={stats}
              orders={orders}
              products={products}
              loading={loadingOrders || loadingProducts}
              onSeeOrders={() => setTab("orders")}
            />
          )}
          {tab === "orders" && <AdminOrders orders={orders} loading={loadingOrders} />}
          {tab === "products" && (
            <AdminProducts products={products} loading={loadingProducts} />
          )}
        </main>
      </div>
    </div>
  );
}