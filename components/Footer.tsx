"use client"
import { MapPin, Github, Twitter, Instagram } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ojuju } from "./Navbar";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className={`${ojuju.className}  text-xl font-bold`}>
                  AmalaJẹun
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Preserving and celebrating Nigerian culture through
                community-driven discovery of authentic Amala spots worldwide.
              </p>
              <Badge
                variant="outline"
                className="border-secondary/30 text-secondary"
              >
                <Github className="w-3 h-3 mr-1" />
                Open Source
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Join Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contributors
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Docs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About Amala
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2025 AmalaJẹun. Built with love for the culture.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
