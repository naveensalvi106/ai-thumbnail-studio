import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sparkles, ArrowLeft, Shield, Upload, Eye, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_EMAIL = "naveensalvi213@gmail.com";

interface ThumbnailRequest {
  id: string;
  title: string;
  description: string | null;
  face_reaction_url: string | null;
  main_image_url: string | null;
  status: string;
  result_url: string | null;
  created_at: string;
  user_id: string;
  user_email?: string;
}

const AdminPanel = () => {
  const [requests, setRequests] = useState<ThumbnailRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/signup"); return; }

    // Check by email
    if (session.user.email !== ADMIN_EMAIL) {
      navigate("/dashboard");
      toast({ title: "Access denied", description: "You don't have admin privileges.", variant: "destructive" });
      return;
    }
    setIsAdmin(true);

    // Fetch all requests using the admin RLS policy (user must have admin role)
    const { data: reqs } = await supabase
      .from("thumbnail_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (reqs) {
      const { data: profiles } = await supabase.from("profiles").select("id, email");
      const emailMap: Record<string, string> = {};
      profiles?.forEach((p: any) => { emailMap[p.id] = p.email; });

      setRequests(reqs.map((r: any) => ({ ...r, user_email: emailMap[r.user_id] || "Unknown" })));
    }
    setLoading(false);
  };

  const handleUploadClick = (requestId: string) => {
    setActiveRequestId(requestId);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRequestId) return;

    setUploadingId(activeRequestId);

    const ext = file.name.split(".").pop();
    const path = `results/${activeRequestId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("thumbnail-uploads")
      .upload(path, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploadingId(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("thumbnail-uploads").getPublicUrl(path);
    const resultUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("thumbnail_requests")
      .update({ result_url: resultUrl, status: "completed", updated_at: new Date().toISOString() })
      .eq("id", activeRequestId);

    if (updateError) {
      toast({ title: "Update failed", description: updateError.message, variant: "destructive" });
    } else {
      setRequests((prev) =>
        prev.map((r) => r.id === activeRequestId ? { ...r, result_url: resultUrl, status: "completed" } : r)
      );
      toast({ title: "Thumbnail uploaded", description: "Request marked as completed." });
    }

    setUploadingId(null);
    setActiveRequestId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

      <nav className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Admin Panel</span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Thumbnail Requests</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {(["all", "pending", "completed"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No requests found</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div key={req.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display text-lg font-semibold text-foreground truncate">{req.title}</h3>
                      <Badge
                        variant="outline"
                        className={req.status === "completed"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.user_email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(req.created_at).toLocaleString()} · ID: {req.id.slice(0, 8)}
                    </p>
                  </div>

                  {req.status !== "completed" && (
                    <Button
                      size="sm"
                      className="gap-2 shrink-0"
                      onClick={() => handleUploadClick(req.id)}
                      disabled={uploadingId === req.id}
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingId === req.id ? "Uploading..." : "Upload Result"}
                    </Button>
                  )}
                </div>

                {req.description && (
                  <p className="text-sm text-foreground/80 mb-4 bg-secondary/50 rounded-lg p-3">
                    {req.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  {req.face_reaction_url && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Face Reaction</p>
                      <a href={req.face_reaction_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={req.face_reaction_url}
                          alt="Face reaction"
                          className="h-24 w-24 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
                        />
                      </a>
                    </div>
                  )}
                  {req.main_image_url && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Main Image</p>
                      <a href={req.main_image_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={req.main_image_url}
                          alt="Main image"
                          className="h-24 w-24 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
                        />
                      </a>
                    </div>
                  )}
                  {req.result_url && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-semibold text-green-400">Result</p>
                      <a href={req.result_url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={req.result_url}
                          alt="Result thumbnail"
                          className="h-24 w-auto object-cover rounded-lg border-2 border-green-500/30 hover:border-green-500/60 transition-colors"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
