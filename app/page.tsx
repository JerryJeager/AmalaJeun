import Footer from "@/components/Footer"
import Final from "@/components/Final"
import Community from "@/components/Community"
import Innovation from "@/components/Innovation"
import How from "@/components/How"
import Story from "@/components/Story"
import Hero from "@/components/Hero"
import Navbar from "@/components/Navbar"

export default function AmalaJẹunLanding() {

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* The Story Section */}
      <Story />

      {/* How It Works Section */}
      <How />

      {/* AI & Innovation Section */}
      <Innovation />

      {/* Community Spirit Section */}
      <Community />

      {/* Final CTA Section */}
      <Final />

      {/* Footer */}
      <Footer />
    </div>
  )
}
