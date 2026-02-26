import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import ScrollingThumbnails from "@/components/ScrollingThumbnails";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Image, Clock } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating orbs
      [orb1Ref, orb2Ref, orb3Ref].forEach((ref, i) => {
        if (ref.current) {
          gsap.to(ref.current, {
            y: -20 + i * 5,
            x: i % 2 === 0 ? 10 : -10,
            duration: 3 + i,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        }
      });

      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(headlineRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(subRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5")
        .fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");

      // Feature cards stagger on scroll
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll(".feature-card");
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-8 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://my.spline.design/orb-jVQDQrzV0H4JLgVnxrEwwOWr/"
            frameBorder="0"
            width="100%"
            height="100%"
            className="absolute inset-0"
            style={{ pointerEvents: "none" }}
            title="3D Background"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>

        {/* Floating glow orbs */}
        <div ref={orb1Ref} className="glow-orb w-96 h-96 bg-primary/20 -top-20 -left-20" />
        <div ref={orb2Ref} className="glow-orb w-72 h-72 bg-secondary/15 top-1/3 right-0" />
        <div ref={orb3Ref} className="glow-orb w-80 h-80 bg-accent/15 bottom-20 left-1/3" />

        <div className="container text-center relative z-10">
          <h1
            ref={headlineRef}
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-foreground max-w-5xl mx-auto opacity-0"
          >
            Create premium, high-CTR thumbnails{" "}
            <span className="gradient-text">in just minutes.</span>
          </h1>
          <p ref={subRef} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto font-light opacity-0">
            Stop using generic thumbnails. Let AntiGeneric AI craft scroll-stopping visuals that get clicks.
          </p>
          <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
            <Link to="/signup">
              <Button size="lg" className="gradient-btn cta-glow gap-2 text-base px-10 py-6 font-semibold border-0 rounded-xl">
                Start Creating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground">
              10 free credits on signup • No card required
            </p>
          </div>
        </div>

        <div className="mt-16 relative z-10">
          <ScrollingThumbnails />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container relative z-10" ref={featuresRef}>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-foreground mb-4 tracking-tighter">
            Why creators choose <span className="gradient-text">AntiGeneric</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 font-light">
            Everything you need to stand out in the feed.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={<Zap className="h-7 w-7" />}
              title="AI-Powered Generation"
              description="Our AI analyzes top-performing thumbnails to create designs optimized for maximum CTR."
            />
            <FeatureCard
              icon={<Image className="h-7 w-7" />}
              title="Premium Quality"
              description="Every thumbnail is HD-ready, designed for YouTube's algorithm and your audience."
            />
            <FeatureCard
              icon={<Clock className="h-7 w-7" />}
              title="Minutes, Not Hours"
              description="Upload your details and get a professional thumbnail back — fast."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container text-center text-sm text-muted-foreground font-light">
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
  <div className="feature-card glass glow-box rounded-2xl p-8 text-center glass-card-hover">
    <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary mb-5">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-card-foreground mb-3 tracking-tight">{title}</h3>
    <p className="text-muted-foreground leading-relaxed font-light">{description}</p>
  </div>
);

export default Index;
