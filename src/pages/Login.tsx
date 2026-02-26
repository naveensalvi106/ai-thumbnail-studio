import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import gsap from "gsap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="glow-orb w-80 h-80 bg-primary/15 top-10 right-10" />
      <div className="glow-orb w-60 h-60 bg-accent/15 bottom-10 left-10" />

      <div ref={formRef} className="w-full max-w-md space-y-8 relative z-10 opacity-0">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="text-2xl font-bold tracking-tighter text-foreground">
              Anti<span className="gradient-text">Generic</span>{" "}
              <span className="text-muted-foreground font-light text-sm">AI</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground tracking-tighter">Welcome back</h1>
          <p className="text-muted-foreground mt-2 font-light">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 glass glow-box rounded-2xl p-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-light">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="bg-muted/30 border-border/50 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-light">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="bg-muted/30 border-border/50 rounded-xl" />
          </div>
          <Button type="submit" className="w-full gradient-btn border-0 rounded-xl font-semibold py-5" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-light">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
