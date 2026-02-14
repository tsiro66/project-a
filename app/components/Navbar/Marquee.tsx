import { MARQUEE_ITEMS } from "./nav-data";

export function Marquee() {
  const content = (
    <div className="flex animate-marquee shrink-0">
      {MARQUEE_ITEMS.map((text, i) => (
        <span key={i} className="text-[10px] md:text-xs font-medium uppercase px-6 text-zinc-900">
          {text}
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-lime-400 py-1 rounded-lg flex whitespace-nowrap overflow-hidden shadow-2xl">
      {content}
      {content}
    </div>
  );
}