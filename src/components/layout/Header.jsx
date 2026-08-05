import { useState } from "react";
import { Menu, Search, Bell, LogOut, ChevronDown } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Header() {
  const { openMobileSidebar } = useUIStore();
  const { profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 backdrop-blur px-4">
      <button className="lg:hidden text-foreground/70" onClick={openMobileSidebar}>
        <Menu size={20} />
      </button>

      <div className="relative hidden md:block w-full max-w-sm">
        <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search orders, customers, PO #..." className="pl-8" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={17} />
        </Button>

        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Avatar name={profile?.full_name || "User"} size={30} />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-sm font-medium">{profile?.full_name || "—"}</p>
              <p className="text-[11px] capitalize text-muted-foreground">{profile?.role || "no role"}</p>
            </div>
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-md border border-border bg-popover shadow-md py-1 animate-fade-in">
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
              >
                <LogOut size={15} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
