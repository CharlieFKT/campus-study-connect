import Link from "next/link";
import { ArrowRight, Flame, Heart, MessageCircle, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { defaultDemoSchool } from "@/lib/default-profile";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/80 via-white to-violet-50/60">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 text-white">
            <Heart className="h-4 w-4" />
          </span>
          CampusSpark
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/safety">Safety</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/onboarding">Join campus</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6 sm:pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-7">
            <Badge variant="secondary" className="rounded-full text-xs font-normal">
              Live at {defaultDemoSchool}
            </Badge>
            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Meet people on campus to study, vibe, and hang.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Swipe through students at your school and connect for study sessions, coffee breaks, gym buddies,
                events, and spontaneous campus plans.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="gap-2 rounded-full" asChild>
                <Link href="/onboarding">
                  Join your campus
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <Link href="/swipe">Start swiping demo</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3 py-1 shadow-sm">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Campus-only profiles
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white/90 px-3 py-1 shadow-sm">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                Fast chat after a match
              </span>
            </div>
          </div>

          <Card className="overflow-hidden shadow-card">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <p className="text-sm font-medium text-foreground">What this demo feels like</p>
              <div className="grid gap-3">
                {[
                  [Flame, "Swipe-style deck with Like / Pass / Super Like"],
                  [Users, "Find people for study, hangouts, and events"],
                  [Sparkles, "Compatibility hints + shared classes/interests"],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-muted-foreground">{text}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Still campus-safe and moderated, but with a social-first vibe instead of career-network energy.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
