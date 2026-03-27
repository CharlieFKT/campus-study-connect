"use client";

import * as React from "react";
import { useDemo } from "@/components/providers/demo-context";
import { getStudentById } from "@/lib/mock-data";
import { computeCompatibility } from "@/lib/match-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CompatibilityCardClient({ studentId }: { studentId: string }) {
  const { profile, ensureGuestProfile } = useDemo();
  React.useEffect(() => {
    ensureGuestProfile();
  }, [ensureGuestProfile]);

  const student = getStudentById(studentId);
  if (!student) return null;
  const { score, reasons } = computeCompatibility(profile, student);

  return (
    <Card className="border-primary/20 bg-primary/[0.03] shadow-soft">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          Why you might work well together
          <Badge>{score}% match</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
