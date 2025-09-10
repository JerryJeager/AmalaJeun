import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
const Community = () => {
  return (
    <section
      id="community"
      className="py-20 lg:py-32 bg-muted/30 cultural-pattern"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 bg-primary/20 text-primary border-primary/30"
          >
            Community Voice
          </Badge>
          <blockquote className="text-2xl md:text-4xl font-bold text-balance mb-8 leading-relaxed">
            "Amala isn't just food — it's a warm embrace from your ancestors,
            wrapped in history and spiced with{" "}
            <span className="text-primary">pride</span>."
          </blockquote>
          <cite className="text-lg text-muted-foreground">— Idris Bello</cite>

          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Be part of the movement</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of culture keepers, food lovers, and community
              builders preserving Nigerian heritage one Amala spot at a time.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Users className="w-5 h-5 mr-2" />
              Join the Community
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
