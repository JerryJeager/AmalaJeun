import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle } from "lucide-react";
const Innovation = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-accent/20 text-accent-foreground border-accent/30"
            >
              🤖 Powered by AI
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              Innovation Meets <span className="text-accent">Tradition</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-accent" />
                  <h3 className="text-2xl font-bold">Autonomous Discovery</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our AI agent continuously scans the web for Amala mentions,
                  social media posts, and reviews, then proposes new spots to
                  the community for verification.
                </p>
              </CardContent>
            </Card>

            <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-secondary/10">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="w-8 h-8 text-secondary" />
                  <h3 className="text-2xl font-bold">Agentic Intake</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Simply chat or speak with our AI to add a new spot. No forms,
                  no hassle — just tell us about your favorite Amala place in
                  your own words.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Innovation;
