import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Plus, CreditCard, ImageIcon, LogOut, Shield } from "lucide-react";
import gsap from "gsap";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/login");
      else {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll(".dash-card");
      gsap.fromTo(cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power3.out" });
    }
  }, [user]);

  const loadProfile = async (userId: string) => {
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).single();
    if (profile) setCredits(profile.credits);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email === "naveensalvi213@gmail.com") setIsAdmin(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating orbs */}
      <div className="glow-orb w-80 h-80 bg-primary/10 -top-20 right-0" />
      <div className="glow-orb w-60 h-60 bg-accent/10 bottom-0 left-0" />

      <nav className="glass-strong border-b border-border/50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tighter text-foreground">
              Anti<span className="gradient-text">Generic</span>{" "}
              <span className="text-muted-foreground font-light text-sm">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="glass flex items-center gap-2 rounded-xl px-4 py-2 text-sm">
              <span className="font-semibold text-foreground">{credits}</span>
              <span className="text-muted-foreground font-light">Credits</span>
            </div>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-2 rounded-lg border-border/50">
                  <Shield className="h-4 w-4" /> Admin
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container py-12 relative z-10">
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tighter">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground mb-10 font-light">What would you like to create today?</p>

        <div ref={cardsRef} className="grid sm:grid-cols-3 gap-6 max-w-3xl">
          <DashCard icon={<Plus className="h-7 w-7" />} title="Create Thumbnail" description="Generate a new high-CTR thumbnail" to="/create" />
          <DashCard icon={<CreditCard className="h-7 w-7" />} title="Buy Credits" description="Get more credits for thumbnails" to="/buy-credits" />
          <DashCard icon={<ImageIcon className="h-7 w-7" />} title="My Thumbnails" description="View your generated thumbnails" to="/my-thumbnails" />
        </div>
      </main>
    </div>
  );
};

const DashCard = ({ icon, title, description, to }: { icon: React.ReactNode; title: string; description: string; to: string }) => (
  <Link to={to}>
    <div className="dash-card glass glow-box rounded-2xl p-6 glass-card-hover cursor-pointer group opacity-0">
      <div className="inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-card-foreground mb-1 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground font-light">{description}</p>
    </div>
  </Link>
);

export default Dashboard;
