import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, Send, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateThumbnail = () => {
  const [user, setUser] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [refUrls, setRefUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/login");
      else setUser(session.user);
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const urls = refUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    const { data, error } = await supabase.functions.invoke("notify-admin", {
      body: { title, description, reference_urls: urls },
    });

    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Request submitted!", description: "We'll get back to you soon." });
      navigate("/dashboard");
    }
  };

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
          <div className="w-20" />
        </div>
      </nav>

      <main className="container py-12 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Create Thumbnail
        </h1>
        <p className="text-muted-foreground mb-8">
          Describe your thumbnail and we'll create it for you. Costs 10 credits.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Made $10K in 30 Days"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Thumbnail Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the style, mood, elements you want..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refs">Reference URLs (one per line)</Label>
            <Textarea
              id="refs"
              value={refUrls}
              onChange={(e) => setRefUrls(e.target.value)}
              placeholder="https://example.com/thumbnail1.jpg&#10;https://example.com/thumbnail2.jpg"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? "Submitting..." : (
              <>
                <Send className="h-4 w-4" /> Submit Request (10 Credits)
              </>
            )}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CreateThumbnail;
