import Navbar from "@/components/Navbar";
import ScrollingThumbnails from "@/components/ScrollingThumbnails";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Image, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 overflow-hidden">
        {/* Ambient glow blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container text-center mb-10 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight text-foreground max-w-4xl mx-auto">
            Create premium, high-CTR thumbnails{" "}
            <span className="gradient-text">in just minutes.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop using generic thumbnails. Let AntiGeneric AI craft scroll-stopping visuals that get clicks.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="gradient-btn gap-2 text-base px-8 font-bold border-0">
                Start Creating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              10 free credits on signup • No card required
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ScrollingThumbnails />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
        <div className="container relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-16">
            Why creators choose <span className="gradient-text">AntiGeneric</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="AI-Powered Generation"
              description="Our AI analyzes top-performing thumbnails to create designs optimized for maximum CTR."
            />
            <FeatureCard
              icon={<Image className="h-8 w-8" />}
              title="Premium Quality"
              description="Every thumbnail is HD-ready, designed for YouTube's algorithm and your audience."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Minutes, Not Hours"
              description="Upload your details and get a professional thumbnail back — fast."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 AntiGeneric AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="glow-box rounded-xl p-8 text-center transition-all duration-300 hover:scale-[1.02]">
    <div className="inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 p-3 text-primary mb-5">
      {icon}
    </div>
    <h3 className="font-display text-xl font-semibold text-card-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

export default Index;
