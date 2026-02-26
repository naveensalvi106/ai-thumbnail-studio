import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Sparkles, Star } from "lucide-react";
import gsap from "gsap";

const packs = [
  { name: "Basic", credits: 40, price: "₹100", popular: false },
  { name: "Moderate", credits: 100, price: "₹250", popular: true },
  { name: "Pro", credits: 400, price: "₹400", popular: false },
];

const BuyCredits = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else {
        setUser(session.user);
        supabase.from("profiles").select("credits").eq("id", session.user.id).single()
          .then(({ data }) => { if (data) setCredits(data.credits); });
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (user && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".credit-card");
      gsap.fromTo(cards, { y: 60, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" });
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="glow-orb w-96 h-96 bg-primary/10 top-0 left-1/4" />
      <div className="glow-orb w-72 h-72 bg-accent/10 bottom-20 right-10" />

      <nav className="glass-strong border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-light">Back</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-foreground">
              Anti<span className="gradient-text">Generic</span>
            </span>
          </Link>
          <div className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm">
            <span className="font-semibold text-foreground">{credits}</span>
            <span className="text-muted-foreground font-light">Credits</span>
          </div>
        </div>
      </nav>

      <main className="container py-12 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tighter">
            Choose Your <span className="gradient-text">Plan</span>
          </h1>
          <p className="text-muted-foreground font-light">
            Pay via UPI and get credits added instantly.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.name}
              className={`credit-card glass glow-box rounded-2xl p-8 text-center glass-card-hover opacity-0 relative ${
                pack.popular ? "ring-1 ring-primary/30" : ""
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold gradient-btn border-0">
                  <Star className="h-3 w-3 inline mr-1" />
                  POPULAR
                </div>
              )}
              <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary mb-5">
                <CreditCard className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2 tracking-tight">{pack.name}</h3>
              <p className="text-4xl font-bold text-foreground mb-1 tracking-tighter">{pack.credits}</p>
              <p className="text-sm text-muted-foreground mb-6 font-light">credits</p>
              <p className="text-2xl font-bold gradient-text mb-6">{pack.price}</p>
              <Button className="w-full gradient-btn border-0 rounded-xl font-semibold">
                Buy Now
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 glass glow-box rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 tracking-tight">How to buy</h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground text-sm font-light">
            <li>Send payment via PhonePe UPI to <span className="font-mono text-foreground font-medium">9358935758@axl</span></li>
            <li>Take a screenshot of the payment confirmation</li>
            <li>Send the screenshot to us on WhatsApp at <span className="font-mono text-foreground font-medium">+91 9358935758</span></li>
            <li>Credits will be added to your account within a few hours</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default BuyCredits;
