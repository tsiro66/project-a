/* eslint-disable react/jsx-no-comment-textnodes */
export const StatusCard = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`hidden sm:flex flex-col justify-between bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-6 lg:p-8 w-full min-h-75 overflow-hidden ${className}`}>
      {/* Top Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-4">
        <div className="space-y-1">
          <p className="text-zinc-300 font-mono text-xs lg:text-sm leading-relaxed">
            <span className="text-lime-400/50 mr-2">//</span> BASED IN GREECE <br />
            <span className="text-lime-400/50 mr-2">//</span> WORKING GLOBALLY
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950/50 px-3 py-1.5 rounded-full border border-zinc-700/30 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
          </span>
          <span className="text-white font-syne text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
            Available for projects
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-8 space-y-4 min-w-0">
        <div className="h-px w-full bg-linear-to-r from-zinc-700/50 to-transparent" />
        <p className="text-lime-400 font-syne font-black uppercase tracking-tighter leading-[0.85] text-3xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl">
          Ready to<br />
          <span className="text-white">build</span> <br />
          now
        </p>
      </div>
    </div>
  );
};