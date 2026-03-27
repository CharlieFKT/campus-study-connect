"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare, UserX, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { getStudentById } from "@/lib/mock-data";
import { examUrgencyBadge } from "@/lib/match-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";
import { CompatibilityCardClient } from "./compatibility-card";

export default function PersonPage() {
  const params = useParams();
  const id = params.id as string;
  const student = getStudentById(id);

  if (!student) {
    return (
      <EmptyState
        icon={UserX}
        title="Student not found"
        description="This profile isn’t in the Pacific Crest demo roster."
        action={
          <Button asChild>
            <Link href="/discover">Back to discover</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-soft md:mx-0 md:h-32 md:w-32">
          <Image src={student.avatarUrl} alt={student.name} fill className="object-cover" sizes="128px" />
        </div>
        <div className="min-w-0 flex-1 space-y-3 text-center md:text-left">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{student.name}</h1>
            <p className="text-muted-foreground">
              {student.major} · {student.year} · {student.school}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {examUrgencyBadge(student) ? (
              <Badge variant="warning">{examUrgencyBadge(student)}</Badge>
            ) : null}
            {student.lookingThisWeek ? <Badge variant="success">Looking this week</Badge> : null}
            {student.activeThisWeek ? <Badge variant="muted">Active this week</Badge> : null}
          </div>
        </div>
      </div>

      <CompatibilityCardClient studentId={student.id} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{student.bio}</p>
            <Separator />
            <div>
              <p className="font-medium text-foreground">Classes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {student.classes.map((c) => (
                  <Badge key={c} variant="secondary">
                    {c}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="font-medium text-foreground">Exam focus</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {student.exams.map((e) => (
                  <li key={e.name}>
                    {e.name} — <span className="text-foreground/80">{e.dateLabel}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Study goals</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {student.studyGoals.map((g) => (
                  <span key={g} className="rounded-md bg-muted px-2 py-1 text-xs">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base">Rhythm & format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Study style</p>
              <p className="mt-1 capitalize">{student.studyStyle.replace(/-/g, " ")}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Availability</p>
              <ul className="mt-1 list-inside list-disc space-y-1 text-muted-foreground">
                {student.availability.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Preferred format</p>
              <p className="mt-1 capitalize">
                {student.meetingFormat === "either" ? "Flexible (in person or virtual)" : student.meetingFormat}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Looking for</p>
              <p className="mt-1">
                {student.lookingFor === "both"
                  ? "Study partner or small group"
                  : student.lookingFor === "group"
                    ? "Small study group"
                    : "1:1 study partner"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Interests</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {student.interests.map((i) => (
                  <Badge key={i} variant="outline" className="font-normal">
                    {i}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap justify-center gap-3 border-t pt-6 md:justify-start">
        <Button asChild>
          <Link href={`/messages?with=${student.id}`} className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Message
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/groups?focus=${encodeURIComponent(student.classes[0] ?? "")}`} className="gap-2">
            <Users className="h-4 w-4" />
            Invite to study group
          </Link>
        </Button>
      </div>
    </div>
  );
}
