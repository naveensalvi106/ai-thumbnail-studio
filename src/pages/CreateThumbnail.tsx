import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateThumbnail = () => {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [faceFile, setFaceFile] = useState<File | null>(null);
  const [facePreview, setFacePreview] = useState<string | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const faceInputRef = useRef<HTMLInputElement>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/signup"); return; }
      setUser(session.user);
      supabase.from("profiles").select("credits").eq("id", session.user.id).single()
        .then(({ data }) => {
          if (data && data.credits < 1) {
            toast({ title: "No credits", description: "You need credits to create thumbnails.", variant: "destructive" });
            navigate("/buy-credits");
          } else if (data) {
            setCredits(data.credits);
          }
        });
    });
  }, [navigate]);

  const handleFileSelect = (file: File | null, type: "face" | "main") => {
    if (!file) return;
    if (type === "face") {
      setFaceFile(file);
      setFacePreview(URL.createObjectURL(file));
    } else {
      setMainFile(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

  const clearFile = (type: "face" | "main") => {
    if (type === "face") {
      setFaceFile(null);
      setFacePreview(null);
      if (faceInputRef.current) faceInputRef.current.value = "";
    } else {
      setMainFile(null);
      setMainPreview(null);
      if (mainInputRef.current) mainInputRef.current.value = "";
    }
  };

  const uploadFile = async (file: File, userId: string, prefix: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${userId}/${prefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("thumbnail-uploads").upload(path, file);
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage.from("thumbnail-uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setLoading(true);

    try {
      let faceUrl: string | null = null;
      let mainUrl: string | null = null;

      if (faceFile) faceUrl = await uploadFile(faceFile, user.id, "face");
      if (mainFile) mainUrl = await uploadFile(mainFile, user.id, "main");

      const { data, error } = await supabase.functions.invoke("notify-admin", {
        body: { title, description, face_reaction_url: faceUrl, main_image_url: mainUrl },
      });

      if (error || data?.error) {
        const msg = data?.error || "Failed to submit request.";
        if (msg === "Insufficient credits") {
          toast({ title: "No credits", description: "Please buy credits first.", variant: "destructive" });
          navigate("/buy-credits");
        } else {
          toast({ title: "Error", description: msg, variant: "destructive" });
        }
        setLoading(false);
      } else {
        // Stay on loading screen — navigate after a delay to simulate generation
        setTimeout(() => {
          toast({ title: "Request submitted!", description: "We'll get back to you soon." });
          navigate("/dashboard");
        }, 3000);
      }
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground animate-pulse">
          AntiGeneric is generating the thumbnail...
        </h2>
        <p className="text-muted-foreground text-sm">This may take a moment</p>
      </div>
    );
  }

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
            <span className="font-semibold text-foreground">{credits ?? "..."} Credits</span>
          </div>
        </div>
      </nav>

      <main className="container py-12 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Create Thumbnail
        </h1>
        <p className="text-muted-foreground mb-8">
          Fill in the details and we'll generate your thumbnail. Costs 1 credit.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-xl p-6">
          {/* Image uploads */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Face Reaction */}
            <div className="space-y-2">
              <Label>Face Reaction (optional)</Label>
              <div
                className="relative border-2 border-dashed border-border rounded-lg h-40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                onClick={() => faceInputRef.current?.click()}
              >
                {facePreview ? (
                  <>
                    <img src={facePreview} alt="Face reaction" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile("face"); }}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background"
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImagePlus className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">Click to upload</p>
                  </div>
                )}
              </div>
              <input
                ref={faceInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "face")}
              />
            </div>

            {/* Main Image */}
            <div className="space-y-2">
              <Label>Main Image (optional)</Label>
              <div
                className="relative border-2 border-dashed border-border rounded-lg h-40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
                onClick={() => mainInputRef.current?.click()}
              >
                {mainPreview ? (
                  <>
                    <img src={mainPreview} alt="Main image" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearFile("main"); }}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background"
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImagePlus className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-xs">Click to upload</p>
                  </div>
                )}
              </div>
              <input
                ref={mainInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null, "main")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How I Made $10K in 30 Days"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Thumbnail Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the style, mood, elements you want in the thumbnail..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <Sparkles className="h-4 w-4" /> Generate Thumbnail (1 Credit)
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CreateThumbnail;
