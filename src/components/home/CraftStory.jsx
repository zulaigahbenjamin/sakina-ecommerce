import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { IMAGES } from "@/data/catalog";

const NOTES = [
  ["01", "One hand, one piece", "A single artisan finishes each burner and mat from first cut to final polish."],
  ["02", "Materials that age", "Solid brass, full-grain leather, washed linen. Nothing that pretends to be new forever."],
  ["03", "Made to be kept", "Small batches, repaired rather than replaced, wrapped in recycled tissue."],
];

export default function CraftStory() {
  return (
    <section id="craft" className="mx-auto max-w-[1500px] scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <Image
              src={IMAGES.craft}
              alt="Hands weaving brass thread into green silk"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-6 -right-4 hidden bg-background px-8 py-6 sm:block">
              <p className="font-display text-4xl">14</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Artisans in the atelier
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <p className="eyebrow">Craftsmanship</p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,3.6vw,3.2rem)] leading-[1.05]">
            The luminous lattice
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-muted-foreground">
            Our work begins with geometry — the same interlacing patterns found
            in mashrabiya screens and manuscript borders. We translate them into
            leather, brass and thread, then make only as many as the atelier can
            finish well.
          </p>

          <dl className="mt-12 space-y-8">
            {NOTES.map(([num, title, body]) => (
              <div key={num} className="flex gap-6 border-t border-border pt-6">
                <dt className="font-mono text-[11px] text-accent">{num}</dt>
                <div>
                  <p className="font-display text-xl">{title}</p>
                  <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </dl>

          <Link to="/story" className="btn-outline mt-12">
            Read the house story
          </Link>
        </div>
      </div>
    </section>
  );
}