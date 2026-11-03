import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || saving) return;
    setSaving(true);
    try {
      await base44.entities.Subscriber.create({ email: email.trim(), source: "homepage" });
      setDone(true);
      setEmail("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">The letter</p>
        <h2 className="mt-5 font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">
          New pieces, quietly announced
        </h2>
        <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
          One letter each month: what left the atelier, what is nearly gone, and
          a short note on the craft behind it. No noise.
        </p>

        {done ? (
          <p className="mt-10 inline-flex items-center gap-2 border border-primary/30 px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-primary">
            <Check className="h-4 w-4" strokeWidth={1.5} /> You are on the list
          </p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-10 flex max-w-md items-end gap-4">
            <label className="flex-1 text-left">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="lux-input"
              />
            </label>
            <button type="submit" disabled={saving} className="btn-primary h-[52px] px-6">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}