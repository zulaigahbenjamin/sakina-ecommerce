import { Link } from "react-router-dom";
import ProductCard from "@/components/site/ProductCard";
import Reveal from "@/components/site/Reveal";

export default function FeaturedProducts({ products }) {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">The curated souq</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2.1rem,3.6vw,3.2rem)] leading-[1.05]">
              Most kept pieces this season
            </h2>
          </div>
          <Link to="/shop" className="link-line self-start text-[11px] uppercase tracking-[0.24em] sm:self-auto">
            Shop everything
          </Link>
        </div>

        <div className="mt-14 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={(i % 3) * 0.07}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}