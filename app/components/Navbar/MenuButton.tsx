interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  label: string;
}

export function MenuButton({ isOpen, onClick, label }: MenuButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 group cursor-pointer text-white z-10">
      <div className="relative w-7 h-5 flex flex-col justify-center items-start">
        <span className={`absolute h-px bg-white transition-all duration-300 ${isOpen ? "w-6 rotate-45" : "w-7 -translate-y-1.5 group-hover:w-3"}`} />
        <span className={`absolute h-px bg-white transition-all duration-300 ${isOpen ? "w-6 -rotate-45" : "w-7 translate-y-1.5"}`} />
      </div>
      <span className="text-xl font-medium hidden md:block font-syne">{label}</span>
    </button>
  );
}