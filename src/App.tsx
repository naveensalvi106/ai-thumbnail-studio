import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Preloader from "@/components/Preloader";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateThumbnail from "./pages/CreateThumbnail";
import AdminPanel from "./pages/AdminPanel";
import BuyCredits from "./pages/BuyCredits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
        <div
          style={{
            opacity: loaded ? 1 : 0,
            filter: loaded ? "blur(0px)" : "blur(10px)",
            transition: "opacity 0.6s ease, filter 0.6s ease",
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateThumbnail />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/buy-credits" element={<BuyCredits />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
