import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Plus, CreditCard, ImageIcon, LogOut } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/login");
      else setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              AntiGeneric <span className="text-primary">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{credits} Credits</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container py-12">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground mb-10">What would you like to create today?</p>

        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl">
          <DashCard
            icon={<Plus className="h-8 w-8" />}
            title="Create Thumbnail"
            description="Generate a new high-CTR thumbnail"
            to="/create"
          />
          <DashCard
            icon={<CreditCard className="h-8 w-8" />}
            title="Buy Credits"
            description="Get more credits for thumbnails"
            to="/buy-credits"
          />
          <DashCard
            icon={<ImageIcon className="h-8 w-8" />}
            title="My Thumbnails"
            description="View your generated thumbnails"
            to="/my-thumbnails"
          />
        </div>
      </main>
    </div>
  );
};

const DashCard = ({
  icon,
  title,
  description,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}) => (
  <Link to={to}>
    <div className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group">
      <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </Link>
);

export default Dashboard;
