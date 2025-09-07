"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Users,
  Sparkles,
  MessageCircle,
  Search,
  Plus,
  ThumbsUp,
  Heart,
  Globe,
  Github,
  Twitter,
  Instagram,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export default function AmalaJẹunLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AmalaJẹun</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
              Community
            </a>
            <Button
              size="sm"
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign In with Google
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <a
                href="#how-it-works"
                className="block text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#community"
                className="block text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Community
              </a>
              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    setIsAuthModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Sign In with Google
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Google Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background border-border/50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Welcome to AmalaJẹun</h2>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground mb-8 text-center">
                Join the community preserving Yoruba culture through authentic Amala discovery.
              </p>

              <Button
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-6 text-lg font-medium"
                onClick={() => {
                  // Google auth functionality would go here
                  console.log("Google auth clicked")
                }}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-6">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 map-pattern overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-accent/20 text-accent-foreground border-accent/30">
              🌍 Global Community • Cultural Heritage • AI-Powered
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 text-foreground">
              Never struggle to find the perfect bowl of <span className="text-primary">Amala</span> again.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto leading-relaxed">
              AmalaJẹun is a crowdsourced global map where the community discovers, verifies, and celebrates Amala spots
              worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Explore the Map
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-primary/30 hover:bg-primary/10 bg-transparent"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add a Spot
              </Button>
            </div>
          </div>
        </div>
        {/* Floating map pins */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-secondary rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse delay-700" />
      </section>

      {/* The Story Section */}
      <section className="py-20 lg:py-32 cultural-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="secondary" className="mb-4 bg-destructive/10 text-destructive border-destructive/20">
                  The Problem
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                  Finding authentic Amala shouldn't be left to luck — it's more than food, it's{" "}
                  <span className="text-primary">culture</span>.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Too many people miss out on authentic Yoruba heritage because they can't find the real spots. Generic
                  food apps don't understand the cultural significance and community knowledge needed.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center">
                  <Search className="w-16 h-16 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mt-20">
              <div className="lg:order-2">
                <Badge variant="secondary" className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
                  The Solution
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
                  We built AmalaJẹun: part map, part <span className="text-secondary">cultural archive</span>.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  It combines AI discovery, community verification, and storytelling to ensure no one misses out on true
                  Yoruba heritage.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium">AI Discovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-secondary" />
                    <span className="text-sm font-medium">Community Verified</span>
                  </div>
                </div>
              </div>
              <div className="lg:order-1 relative">
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <Globe className="w-16 h-16 text-secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
              Your Journey to Authentic <span className="text-primary">Amala</span>
            </h2>
            <p className="text-xl text-muted-foreground text-balance">
              Four simple steps to connect with Yoruba culture worldwide
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
                  Browse verified Amala spots near you with detailed reviews and cultural context.
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
                  Add spots via our interactive map or simply chat with our AI assistant.
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
                  Vote on new spots, share reviews, and upload photos to help the community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Celebrate</h3>
                <p className="text-muted-foreground">Join a global tribe preserving and sharing the Amala story.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI & Innovation Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent-foreground border-accent/30">
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
                    Our AI agent continuously scans the web for Amala mentions, social media posts, and reviews, then
                    proposes new spots to the community for verification.
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
                    Simply chat or speak with our AI to add a new spot. No forms, no hassle — just tell us about your
                    favorite Amala place in your own words.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community Spirit Section */}
      <section id="community" className="py-20 lg:py-32 bg-muted/30 cultural-pattern">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-primary/20 text-primary border-primary/30">
              Community Voice
            </Badge>
            <blockquote className="text-2xl md:text-4xl font-bold text-balance mb-8 leading-relaxed">
              "Amala isn't just food — it's a warm embrace from your ancestors, wrapped in history and spiced with{" "}
              <span className="text-primary">pride</span>."
            </blockquote>
            <cite className="text-lg text-muted-foreground">— Idris Bello</cite>

            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Be part of the movement</h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of culture keepers, food lovers, and community builders preserving Yoruba heritage one
                Amala spot at a time.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Users className="w-5 h-5 mr-2" />
                Join the Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-balance mb-8">
              Join us. Map the culture. <span className="text-primary">Taste the future.</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
              Every spot you add, every review you share, every vote you cast helps preserve and celebrate Yoruba
              culture for generations to come.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
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

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-bold">AmalaJẹun</span>
                </div>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Preserving and celebrating Yoruba culture through community-driven discovery of authentic Amala spots
                  worldwide.
                </p>
                <Badge variant="outline" className="border-secondary/30 text-secondary">
                  <Github className="w-3 h-3 mr-1" />
                  Open Source
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Join Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Contributors
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Guidelines
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      API Docs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-foreground transition-colors">
                      About Amala
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50">
              <p className="text-muted-foreground text-sm mb-4 md:mb-0">
                © 2024 AmalaJẹun. Built with love for the culture.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
