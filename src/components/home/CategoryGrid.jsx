import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { CATEGORIES } from "@/data/catalog";

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Collections</p>
          <h2 className="mt-4 max-w-lg font-display text-[clamp(2.1rem,3.6vw,3.2rem)] leading-[1.05]">
            Eight shelves, one quiet home
          </h2>
        </div>
        <Link to="/shop" className="link-line self-start text-[11px] uppercase tracking-[0.24em] sm:self-auto">
          View all pieces
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {CATEGORIES.map((category, i) => (
          <Reveal key={category.name} delay={(i % 4) * 0.06}>
            <Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="group block">
              <div className="overflow-hidden bg-secondary">
                <Image
                  src={category.image}
                  alt={category.name}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between border-b border-transparent pb-2 transition-colors duration-500 group-hover:border-border">
                <span className="font-display text-lg">{category.name}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}