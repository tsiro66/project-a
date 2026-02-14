interface LogoProps {
  onClick: () => void;
}

export function Logo({ onClick }: LogoProps) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 text-white cursor-pointer z-10"
      onClick={onClick}
    >
      <span className="text-xl md:text-3xl font-syne font-black tracking-wider uppercase pointer-events-auto">
        FLUX
      </span>
    </div>
  );
}