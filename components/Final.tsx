import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
const Final = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-8">
            Join us. Map the culture.{" "}
            <span className="text-primary">Taste the future.</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
            Every spot you add, every review you share, every vote you cast
            helps preserve and celebrate Yoruba culture for generations to come.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explore Map
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/10 bg-transparent"
            >
              <Plus className="w-5 h-5 mr-2" />
              Contribute Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Final;
