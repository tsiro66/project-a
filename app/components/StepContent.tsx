export default function StepContent({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="content-block max-w-lg border-l-2 border-black/10 pl-6 md:border-none md:pl-0">
      <span className="font-mono text-sm mb-2 block opacity-50 tracking-widest">
        — PHASE {number}
      </span>
      <h3 className="text-5xl md:text-6xl font-black uppercase mb-4 leading-none">
        {title}
      </h3>
      <p className="text-lg md:text-xl font-medium leading-relaxed">{text}</p>
    </div>
  );
}
