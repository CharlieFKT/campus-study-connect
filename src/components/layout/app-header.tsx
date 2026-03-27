"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Heart, LayoutGrid, MessageCircle, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { defaultDemoSchool } from "@/lib/default-profile";

const nav = [
  { href: "/swipe", label: "Swipe", icon: Flame },
  { href: "/dashboard", label: "Explore", icon: LayoutGrid },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/messages", label: "Chats", icon: MessageCircle },
  { href: "/safety", label: "Safety", icon: Shield },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="safe-pt sticky top-0 z-40 border-b bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-3 sm:h-16 sm:gap-6 sm:px-6">
        <Link href="/swipe" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary shadow-soft">
            <Heart className="h-4 w-4" />
          </span>
          <span className="hidden sm:flex flex-col leading-tight">
            <span>CampusSpark</span>
            <span className="text-[10px] font-normal text-muted-foreground">{defaultDemoSchool}</span>
          </span>
        </Link>
        <nav className="ml-auto flex flex-wrap items-center gap-1 sm:gap-2">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Button key={href} variant={active ? "default" : "ghost"} size="sm" asChild className="rounded-full text-xs sm:text-sm">
                <Link href={href} className={cn("gap-1.5", active && "shadow-sm")}>
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  <span className="hidden md:inline">{label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#edf3fa] via-background to-[#e7eef6]">
      <AppHeader />
      <main className="safe-pb mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
