import Reveal from "@/components/site/Reveal";

const QUOTES = [
  {
    quote:
      "The burner arrived wrapped like a gift from a museum shop. It has not left my dining table since.",
    name: "Aisha R.",
    place: "London",
  },
  {
    quote:
      "I bought the travel mat for Umrah. It folds into my bag and still feels like something I will hand down.",
    name: "Yusuf K.",
    place: "Toronto",
  },
  {
    quote:
      "The hijab colours are exactly as photographed, and the drape is the best I own at this price.",
    name: "Layla M.",
    place: "Dubai",
  },
];

export default function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/40">
      <div className="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:py-28">
        <p className="eyebrow text-center">Kept by our clients</p>
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {QUOTES.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col">
                <span className="font-display text-4xl leading-none text-accent">“</span>
                <blockquote className="mt-4 font-display text-[22px] leading-[1.4] text-foreground">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-8 border-t border-border pt-5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {item.name} · {item.place}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}