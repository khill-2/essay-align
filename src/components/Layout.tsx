import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-serif font-medium text-lg text-foreground hover:text-primary transition-colors">
            EssayAlign
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm transition-colors hover:text-foreground ${isActive("/") ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className={`text-sm transition-colors hover:text-foreground ${isActive("/dashboard") ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Dashboard
            </Link>
            <Link
              to="/upload"
              className={`text-sm transition-colors hover:text-foreground ${isActive("/upload") ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              Analyze
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:block">
                  {user.user_metadata?.full_name?.split(" ")[0] || user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-serif font-medium">EssayAlign</span>
          <p className="text-sm text-muted-foreground">AI-powered college essay analysis</p>
          <p className="text-sm text-muted-foreground">© 2025 EssayAlign</p>
        </div>
      </footer>
    </div>
  );
};
