import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, ThumbsUp, Heart } from "lucide-react";
const How = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            Your Journey to Authentic{" "}
            <span className="text-primary">Amala</span>
          </h2>
          <p className="text-xl text-muted-foreground text-balance">
            Four simple steps to connect with Nigerian culture worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Discover</h3>
              <p className="text-muted-foreground">
                Browse verified Amala spots near you with detailed reviews and
                cultural context.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Contribute</h3>
              <p className="text-muted-foreground">
                Add spots via our interactive map or simply chat with our AI
                assistant.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verify</h3>
              <p className="text-muted-foreground">
                Vote on new spots, share reviews, and upload photos to help the
                community.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Celebrate</h3>
              <p className="text-muted-foreground">
                Join a global tribe preserving and sharing the Amala story.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default How;
