import { Badge } from "@/components/ui/badge";
import { Users, Sparkles } from "lucide-react";

import story1 from "../public/story.png";
import story2 from "../public/story2.png";
import Image from "next/image";
const Story = () => {
  return (
    <section className="py-20 lg:py-32 cultural-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge
                variant="secondary"
                className="mb-4 bg-destructive/10 text-destructive border-destructive/20"
              >
                The Problem
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                Finding authentic Amala shouldn't be left to luck — it's more
                than food, it's <span className="text-primary">culture</span>.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Too many people miss out on authentic Yoruba heritage because
                they can't find the real spots. Generic food apps don't
                understand the cultural significance and community knowledge
                needed.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl">
                <Image
                  src={story1}
                  className="w-full h-full rounded-2xl"
                  alt="image-of-amalajeun-community"
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
            <div className="lg:order-2">
              <Badge
                variant="secondary"
                className="mb-4 bg-secondary/20 text-secondary border-secondary/30"
              >
                The Solution
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                We built AmalaJẹun: part map, part{" "}
                <span className="text-secondary">cultural archive</span>.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                It combines AI discovery, community verification, and
                storytelling to ensure no one misses out on true Yoruba
                heritage.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">AI Discovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">
                    Community Verified
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:order-1 relative">
              <div className="aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <Image
                  src={story2}
                  className="w-full h-full rounded-2xl"
                  alt="image-of-amalajeun-community"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
