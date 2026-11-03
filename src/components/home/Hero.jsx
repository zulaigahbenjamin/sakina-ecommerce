import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/catalog";

export default function Hero() {
  return (
    <section className="relative grid min-h-[100svh] lg:grid-cols-[1.38fr_1fr]">
      <div className="relative order-2 overflow-hidden lg:order-1 lg:min-h-[100svh]">
        <Image
          src={IMAGES.hero}
          alt="A folded prayer mat beside a brass bukhoor burner in golden afternoon light"
          className="h-[62vh] w-full object-cover lg:h-full"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <p className="absolute bottom-7 left-6 text-[9px] uppercase tracking-[0.38em] text-white/85 sm:left-10">
          The Ramadan Atelier · 1447
        </p>
      </div>

      <div className="order-1 flex flex-col justify-center px-6 pb-14 pt-32 sm:px-10 lg:order-2 lg:px-14 lg:pb-0 lg:pt-[74px]">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          Sacred Modernity
        </motion.p>

        <motion.h1
          className="mt-6 font-display text-[clamp(2.9rem,5.2vw,4.6rem)] font-light leading-[0.98]"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
        >
          Objects of
          <br />
          devotion, made
          <br />
          <span className="italic text-primary">to be kept.</span>
        </motion.h1>

        <motion.p
          className="mt-7 max-w-sm text-[16px] leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.42 }}
        >
          Hand-finished prayer mats, bukhoor burners, arabic phone covers and
          modest wear — crafted in small batches for the quiet rituals of
          everyday faith.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
        >
          <Link to="/shop" className="btn-primary group">
            Explore the collection
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
          <a href="#craft" className="btn-outline">
            Our craftsmanship
          </a>
        </motion.div>

        <motion.dl
          className="mt-14 grid grid-cols-3 gap-4 border-t border-border pt-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.75 }}
        >
          {[
            ["Small batch", "Made by hand"],
            ["Worldwide", "3–5 day delivery"],
            ["30 days", "Easy returns"],
          ].map(([title, sub]) => (
            <div key={title}>
              <dt className="font-display text-lg">{title}</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {sub}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}