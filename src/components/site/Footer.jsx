import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/site/Logo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const POLICIES = {
  shipping: {
    title: "Shipping & delivery",
    body: "Orders are prepared within one working day. Standard delivery is 3–5 working days, express is 1–2. Delivery is complimentary on orders over $150. Every parcel is wrapped in recycled tissue and sealed with a brass wax stamp.",
  },
  returns: {
    title: "Returns & exchanges",
    body: "Unused pieces may be returned within 30 days of delivery for a full refund. Return the item in its original wrapping with the atelier card enclosed. Prayer mats and hijabs must be unopened for hygiene reasons. Exchanges are always free.",
  },
  care: {
    title: "Care guide",
    body: "Brass develops a patina with use; polish with a dry cloth to restore shine. Prayer mats should be aired rather than machine washed. Silk-modal hijabs hand wash cold and dry flat, away from direct sun.",
  },
};

export default function Footer() {
  const [policy, setPolicy] = useState(null);

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              A modern atelier for the objects of everyday faith — made slowly,
              in small batches, to be kept for decades.
            </p>
          </div>

          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><Link className="link-line" to="/shop">All pieces</Link></li>
              <li><Link className="link-line" to="/shop?category=Prayer%20Mats">Prayer mats</Link></li>
              <li><Link className="link-line" to="/shop?category=Hijabs">Hijabs</Link></li>
              <li><Link className="link-line" to="/shop?category=Tasbeehs">Tasbeehs</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">House</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li><Link className="link-line" to="/story">Our story</Link></li>
              <li><Link className="link-line" to="/cart">Your bag</Link></li>
              <li><Link className="link-line" to="/admin">Atelier dashboard</Link></li>
              {Object.entries(POLICIES).map(([key, value]) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setPolicy(value)}
                    className="link-line capitalize text-left"
                  >
                    {key === "care" ? "Care guide" : value.title.split(" & ")[0]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Atelier</p>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Studio hours, Monday to Saturday.
              <br />
              Worldwide delivery from Dubai.
            </p>
            <p className="mt-4 text-[15px]">
              <a href="mailto:hello@sakinahouse.com" className="link-line">
                hello@sakinahouse.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-[11px] uppercase tracking-[0.24em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Sakīna House. All rights reserved.</span>
          <span>Made with intention</span>
        </div>
      </div>

      <Dialog open={!!policy} onOpenChange={(o) => !o && setPolicy(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-light">
              {policy?.title}
            </DialogTitle>
            <DialogDescription className="pt-3 text-[15px] leading-relaxed text-muted-foreground">
              {policy?.body}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
}