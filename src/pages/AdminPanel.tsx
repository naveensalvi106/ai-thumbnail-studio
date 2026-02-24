import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThumbnailRequest {
  id: string;
  title: string;
  description: string | null;
  reference_urls: string[] | null;
  status: string;
  result_url: string | null;
  created_at: string;
  user_id: string;
  user_email?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const AdminPanel = () => {
  const [requests, setRequests] = useState<ThumbnailRequest[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);

    const admin = roles?.some((r: any) => r.role === "admin");
    if (!admin) {
      navigate("/dashboard");
      toast({
        title: "Access denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      return;
    }
    setIsAdmin(true);

    // Fetch all requests
    const { data: reqs } = await supabase
      .from("thumbnail_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (reqs) {
      // Get user emails from profiles
      const userIds = [...new Set(reqs.map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email");

      const emailMap: Record<string, string> = {};
      profiles?.forEach((p: any) => {
        emailMap[p.id] = p.email;
      });

      setRequests(
        reqs.map((r: any) => ({ ...r, user_email: emailMap[r.user_id] || "Unknown" }))
      );
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("thumbnail_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      toast({ title: "Status updated" });
    }
  };

  const updateResultUrl = async (id: string, url: string) => {
    const { error } = await supabase
      .from("thumbnail_requests")
      .update({ result_url: url, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, result_url: url } : r))
      );
    }
  };

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
      <nav className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Admin Panel
            </span>
          </div>
          <div className="w-20" />
        </div>
      </nav>

      <main className="container py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            Thumbnail Requests
          </h1>
          <p className="text-muted-foreground text-sm">
            {requests.length} total requests
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>References</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result URL</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="text-sm">{req.user_email}</TableCell>
                  <TableCell className="font-medium">{req.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {req.description || "—"}
                  </TableCell>
                  <TableCell>
                    {req.reference_urls?.length ? (
                      <div className="flex flex-col gap-1">
                        {req.reference_urls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-xs hover:underline truncate max-w-[150px] block"
                          >
                            {url}
                          </a>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={req.status}
                      onValueChange={(val) => updateStatus(req.id, val)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Paste result URL"
                      defaultValue={req.result_url || ""}
                      className="w-[180px] text-xs"
                      onBlur={(e) => updateResultUrl(req.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(req.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No requests yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
