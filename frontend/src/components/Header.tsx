import { X } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3 px-4 flex items-center">
      <button className="w-10 h-10 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all">
        <X className="w-5 h-5" strokeWidth={2} />
      </button>
    </header>
  );
};

export default Header;