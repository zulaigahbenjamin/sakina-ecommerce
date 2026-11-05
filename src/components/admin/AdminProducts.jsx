import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ProductForm from "@/components/admin/ProductForm";
import { Image } from "@/components/ui/image";
import { money } from "@/lib/format";

export default function AdminProducts({ products, loading }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["products-all"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const save = async (values) => {
    if (editing?.id) {
      await base44.entities.Product.update(editing.id, values);
    } else {
      await base44.entities.Product.create(values);
    }
    refresh();
  };

  const remove = async (product) => {
    if (!window.confirm(`Remove “${product.name}” from the atelier?`)) return;
    await base44.entities.Product.delete(product.id);
    refresh();
  };

  const toggleActive = async (product) => {
    await base44.entities.Product.update(product.id, { active: !product.active });
    refresh();
  };

  return (
    <div>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-white/35">Catalogue</p>
          <h1 className="mt-3 font-display text-4xl">Pieces</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#FBFAF7] px-6 py-3.5 text-[11px] uppercase tracking-[0.22em] text-[#0B0F0E]"
        >
          <Plus className="h-4 w-4" strokeWidth={1.6} /> New piece
        </button>
      </header>

      {loading ? (
        <p className="py-16 text-[14px] text-white/40">Loading the catalogue…</p>
      ) : products.length === 0 ? (
        <p className="py-16 text-[14px] text-white/40">
          Nothing in the catalogue yet. Add your first piece.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-white/[0.07]">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
              <div className="w-14 shrink-0 overflow-hidden bg-white/5">
                {product.image ? (
                  <Image src={product.image} alt={product.name} className="aspect-[4/5] w-full object-cover" />
                ) : (
                  <div className="aspect-[4/5] w-full" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px]">{product.name}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">
                  {product.category} · {money(product.price)}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <span className={`text-[11px] ${(product.stock ?? 0) <= 5 ? "text-amber-300/80" : "text-white/45"}`}>
                  {product.stock ?? 0} in stock
                </span>
                <button
                  type="button"
                  onClick={() => toggleActive(product)}
                  className={`border px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-colors ${
                    product.active
                      ? "border-emerald-300/30 text-emerald-300/80"
                      : "border-white/15 text-white/35"
                  }`}
                >
                  {product.active ? "Live" : "Hidden"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(product);
                    setOpen(true);
                  }}
                  className="text-white/45 transition-colors hover:text-white"
                  aria-label={`Edit ${product.name}`}
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.4} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(product)}
                  className="text-white/45 transition-colors hover:text-red-300"
                  aria-label={`Delete ${product.name}`}
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ProductForm
        open={open}
        product={editing}
        categories={categories}
        onClose={() => setOpen(false)}
        onSave={save}
      />
    </div>
  );
}