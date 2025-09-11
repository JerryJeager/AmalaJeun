import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";
const Hero = () => {
  return (
    <section className="relative py-20 lg:py-32 map-pattern overflow-hidden bg-[url('/hero.png')]  bg-cover bg-no-repeat bg-center">
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-accent/20 text-accent-foreground border-accent/30"
          >
            🌍 Global Community • Cultural Heritage • AI-Powered
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 text-foreground">
            Never struggle to find the perfect bowl of{" "}
            <span className="text-primary">Amala</span> again.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto leading-relaxed">
            AmalaJẹun is a crowdsourced global map where the community
            discovers, verifies, and celebrates Amala spots worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/map">
              {" "}
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg cursor-pointer"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore the Map
              </Button>
            </Link>
            <Link href="/map">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add a Spot
              </Button>
            </Link>
          </div>
        </div>
      </div>
      {/* Floating map pins */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-secondary rounded-full animate-pulse delay-300" />
      <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse delay-700" />
    </section>
  );
};

export default Hero;
