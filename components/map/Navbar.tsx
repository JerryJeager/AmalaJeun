import { MapPin } from "lucide-react";
import Link from "next/link";
import { ojuju } from "../Navbar";

const Navbar = () => {
  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span
              className={`text-xl font-bold text-foreground ${ojuju.className}`}
            >
              AmalaJẹun
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
