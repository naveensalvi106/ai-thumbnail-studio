import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tighter text-foreground">
            Anti<span className="gradient-text">Generic</span>{" "}
            <span className="text-muted-foreground font-light text-sm">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground font-light">
              Log in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="gradient-btn border-0 font-semibold rounded-lg px-5">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
