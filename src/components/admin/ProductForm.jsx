import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EMPTY = {
  name: "",
  slug: "",
  category: "",
  price: "",
  compare_at_price: "",
  stock: "",
  image: "",
  images: "",
  short: "",
  description: "",
  materials: "",
  badge: "",
  featured: false,
  active: true,
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ProductForm({ open, product, categories, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setForm({
        ...EMPTY,
        ...product,
        compare_at_price: product.compare_at_price ?? "",
        images: (product.images || []).join("\n"),
      });
    } else {
      setForm(EMPTY);
    }
  }, [open, product]);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const gallery = form.images
        ? form.images.split("\n").map((s) => s.trim()).filter(Boolean)
        : [form.image].filter(Boolean);

      await onSave({
        name: form.name,
        slug: form.slug || slugify(form.name),
        category: form.category,
        price: Number(form.price) || 0,
        compare_at_price: Number(form.compare_at_price) || 0,
        stock: Number(form.stock) || 0,
        image: form.image || gallery[0] || "",
        images: gallery.length ? gallery : form.image ? [form.image] : [],
        short: form.short,
        description: form.description,
        materials: form.materials,
        badge: form.badge,
        featured: !!form.featured,
        active: !!form.active,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1 w-full border border-white/15 bg-transparent px-3 py-2.5 text-[14px] text-[#FBFAF7] placeholder:text-white/25 focus:border-white/50 focus:outline-none";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-[#0F1413] text-[#FBFAF7]">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl font-light">
            {product ? "Edit piece" : "New piece"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Name</span>
              <input required value={form.name} onChange={set("name")} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Category</span>
              <input
                required
                value={form.category}
                onChange={set("category")}
                list="admin-categories"
                className={inputClass}
              />
              <datalist id="admin-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Price ($)</span>
              <input required type="number" min="0" step="0.01" value={form.price} onChange={set("price")} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Compare at ($)</span>
              <input type="number" min="0" step="0.01" value={form.compare_at_price} onChange={set("compare_at_price")} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Stock</span>
              <input type="number" min="0" value={form.stock} onChange={set("stock")} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Badge</span>
              <input value={form.badge} onChange={set("badge")} placeholder="Bestseller, New…" className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Main image URL</span>
            <input value={form.image} onChange={set("image")} className={inputClass} />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Gallery URLs (one per line)
            </span>
            <textarea rows={3} value={form.images} onChange={set("images")} className={inputClass} />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Short line</span>
            <input value={form.short} onChange={set("short")} className={inputClass} />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Description</span>
            <textarea rows={4} value={form.description} onChange={set("description")} className={inputClass} />
          </label>

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Materials & craft</span>
            <input value={form.materials} onChange={set("materials")} className={inputClass} />
          </label>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/60">
              <input type="checkbox" checked={!!form.featured} onChange={set("featured")} className="h-4 w-4 accent-[#C5B358]" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-white/60">
              <input type="checkbox" checked={!!form.active} onChange={set("active")} className="h-4 w-4 accent-[#C5B358]" />
              Visible in store
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-[#FBFAF7] py-4 text-[11px] uppercase tracking-[0.22em] text-[#0B0F0E] disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? "Save changes" : "Add piece"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}