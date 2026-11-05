import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/site/Logo";
import { useCart } from "@/lib/CartContext";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Shop all", to: "/shop" },
  { label: "Prayer mats", to: "/shop?category=Prayer%20Mats" },
  { label: "Bukhoor", to: "/shop?category=Bukhoor%20Burners" },
  { label: "Modest wear", to: "/shop?category=Islamic%20Wear" },
  { label: "Our story", to: "/story" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { pathname } = useLocation();
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || !overHero;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          solid
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center justify-between px-5 sm:px-8">
          <Logo compact={scrolled} />

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="link-line text-[11px] uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link
              to="/cart"
              className="group relative flex h-11 w-11 items-center justify-center"
              aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-[18px] w-[18px] transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={1.3} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" strokeWidth={1.3} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-background px-6 py-6 lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.3} />
              </button>
            </div>
            <nav className="mt-16 flex flex-col gap-7">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="font-display text-4xl text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-border pt-6 text-sm text-muted-foreground">
              Hand-finished in small batches · Worldwide delivery
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}