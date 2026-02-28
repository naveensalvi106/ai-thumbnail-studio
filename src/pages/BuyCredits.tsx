import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, CreditCard } from "lucide-react";

const packs = [
  { name: "Basic", credits: 40, price: "₹100" },
  { name: "Moderate", credits: 100, price: "₹250" },
  { name: "Pro", credits: 400, price: "₹400" },
];

const BuyCredits = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              AntiGeneric <span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">{credits} Credits</span>
          </div>
        </div>
      </nav>

      <main className="container py-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Buy Credits</h1>
        <p className="text-muted-foreground mb-8">
          Pay via UPI to <span className="font-mono text-foreground">9358935758@axl</span> and send a screenshot to get credits added manually.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.name}
              className="rounded-xl border border-border bg-card p-6 text-center hover:border-primary/50 transition-all"
            >
              <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">{pack.name}</h3>
              <p className="text-3xl font-bold text-foreground mb-1">{pack.credits}</p>
              <p className="text-sm text-muted-foreground mb-4">credits</p>
              <p className="text-xl font-semibold text-primary">{pack.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">How to buy</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
            <li>Send payment via PhonePe UPI to <span className="font-mono text-foreground">9358935758@axl</span></li>
            <li>Take a screenshot of the payment confirmation</li>
            <li>Send the screenshot to us on WhatsApp at <span className="font-mono text-foreground">+91 9358935758</span></li>
            <li>Credits will be added to your account within a few hours</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default BuyCredits;
