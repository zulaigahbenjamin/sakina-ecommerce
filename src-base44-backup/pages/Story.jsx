import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { IMAGES } from "@/data/catalog";

const CHAPTERS = [
  {
    title: "A house, not a shop",
    body: "Sakīna House began with a single question: why should the objects of daily faith be the least considered things we own? We set up a small atelier to answer it — prayer mats with weight and drape, burners that hold heat properly, cases that age instead of peel.",
  },
  {
    title: "Geometry as devotion",
    body: "Every pattern we use is drawn from the interlacing geometries of mashrabiya screens and manuscript borders. Nothing is licensed, nothing is borrowed from a catalogue. Our designers redraw each motif by hand before it reaches an artisan.",
  },
  {
    title: "Slow by intention",
    body: "We release a small number of pieces each season and stop when the quality slips. If a piece sells out before you reach it, that is the atelier working as it should.",
  },
];

export default function Story() {
  return (
    <div className="pt-[74px]">
      <section className="relative">
        <Image
          src={IMAGES.heritage}
          alt="A carved wooden book stand holding a leather-bound book in a sunlit room"
          className="h-[52vh] w-full object-cover lg:h-[64vh]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 lg:pb-16">
          <p className="text-[10px] uppercase tracking-[0.34em] text-white/80">Since 2019 · Dubai</p>
          <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-white">
            The house behind the objects
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="eyebrow">Our intention</p>
            <p className="mt-6 font-display text-[26px] leading-[1.4]">
              “We wanted to make the things you touch five times a day feel like
              the most beautiful things you own.”
            </p>
            <p className="mt-5 text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
              Maryam Al-Haddad · Founder
            </p>
          </div>

          <div className="space-y-12">
            {CHAPTERS.map((chapter, i) => (
              <Reveal key={chapter.title} delay={i * 0.05}>
                <div className="border-t border-border pt-6">
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                    <div>
                      <h2 className="font-display text-2xl">{chapter.title}</h2>
                      <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
                        {chapter.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-16 sm:grid-cols-3 sm:px-8">
          {[
            ["14", "Artisans in the atelier"],
            ["100%", "Recycled wrapping"],
            ["42", "Countries delivered to"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-5xl">{value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-20 text-center sm:px-8">
        <h2 className="font-display text-[clamp(2rem,3.6vw,3rem)]">Begin with one piece</h2>
        <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Most people start with a mat or a burner. Both are made to outlast the
          season they were bought in.
        </p>
        <Link to="/shop" className="btn-primary mt-9">Explore the collection</Link>
      </section>
    </div>
  );
}