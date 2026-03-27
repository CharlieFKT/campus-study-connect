import Link from "next/link";
import { MailCheck, School, ShieldAlert, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { defaultDemoSchool } from "@/lib/default-profile";

export default function SafetyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trust &amp; safety</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          CampusStudy is intentionally academic. These guardrails are product copy for the demo — in production they
          would sit next to enforceable policies and support workflows.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <School className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Campus-only access</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Accounts are scoped to <span className="font-medium text-foreground">{defaultDemoSchool}</span> in this pilot.
            The graph stays school-specific so introductions stay relevant and accountable.
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <MailCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">School email verification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Email verification reduces off-campus noise and helps admins reason about abuse. The demo simulates this
            step without sending mail.
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Reporting &amp; blocking</CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-muted-foreground">
            Every profile and message surface would include report flows, escalation to campus partners, and blocking that
            hides future suggestions. No casual “dating UX” patterns — keep it professional.
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0">
            <UserX className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Community guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <ul className="list-inside list-disc space-y-1">
              <li>Lead with coursework goals and respectful scheduling.</li>
              <li>Meet in public campus spaces or official tools when possible.</li>
              <li>No harassment, discrimination, or off-platform coercion.</li>
              <li>Academic integrity: collaborate ethically within course rules.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            We designed the UI to feel closer to LinkedIn + Discord for coursework — not a swipe app.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Back to landing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
