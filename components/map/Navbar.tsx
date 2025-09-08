"use client";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AmalaJẹun</span>
        </div>

        {/* Navigation */}
        {/* <div className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#community"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Community
          </a>
          <Button
            size="sm"
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Sign In with Google
          </Button>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
