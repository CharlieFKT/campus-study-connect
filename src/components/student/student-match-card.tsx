import Image from "next/image";
import Link from "next/link";
import { MessageSquare, UserPlus } from "lucide-react";
import type { DemoProfile, Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { computeCompatibility, examUrgencyBadge } from "@/lib/match-utils";
type Props = {
  student: Student;
  viewer: DemoProfile | null;
  className?: string;
};

export function StudentMatchCard({ student, viewer, className }: Props) {
  const { score, reasons } = computeCompatibility(viewer, student);
  const examBadge = examUrgencyBadge(student);

  return (
    <Card className={cn("overflow-hidden shadow-soft transition-shadow hover:shadow-card", className)}>
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image src={student.avatarUrl} alt={student.name} fill className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-foreground">{student.name}</h3>
            <Badge variant="outline" className="font-normal">
              {score}% match
            </Badge>
            {examBadge ? (
              <Badge variant="warning" className="font-normal">
                {examBadge}
              </Badge>
            ) : null}
            {student.lookingThisWeek ? (
              <Badge variant="success" className="font-normal">
                Looking this week
              </Badge>
            ) : null}
            {student.activeThisWeek ? (
              <Badge variant="muted" className="font-normal">
                Active this week
              </Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {student.major} · {student.year}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {student.classes.slice(0, 3).map((c) => (
              <span key={c} className="rounded-md bg-secondary/80 px-2 py-0.5 text-xs text-secondary-foreground">
                {c}
              </span>
            ))}
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-foreground/90">{student.bio}</p>
          <div className="flex flex-wrap gap-2">
            {reasons.slice(0, 4).map((r) => (
              <span key={r} className="rounded-full border border-border bg-white/60 px-2.5 py-0.5 text-xs text-muted-foreground">
                {r}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button size="sm" asChild>
              <Link href={`/messages?with=${student.id}`} className="gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Message
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/groups?focus=${encodeURIComponent(student.classes[0] ?? "")}`} className="gap-1.5">
                <UserPlus className="h-4 w-4" />
                Invite out
              </Link>
            </Button>
            <Link href={`/people/${student.id}`} className="text-xs font-medium text-primary hover:underline">
              See profile
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
