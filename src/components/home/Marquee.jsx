const ITEMS = [
  "Complimentary delivery over $150",
  "Hand-finished in small batches",
  "Brass sealed with a wax stamp",
  "30-day returns",
  "Made for the everyday ritual",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border bg-secondary/60 py-4">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
        {[0, 1].map((run) => (
          <div key={run} className="flex gap-14">
            {ITEMS.map((item) => (
              <span
                key={`${run}-${item}`}
                className="flex items-center gap-14 text-[10px] uppercase tracking-[0.32em] text-muted-foreground"
              >
                {item}
                <span className="h-1 w-1 rotate-45 bg-accent" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}