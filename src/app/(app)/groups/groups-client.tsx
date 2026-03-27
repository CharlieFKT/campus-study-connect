"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Plus, Users } from "lucide-react";
import { mockStudyGroups } from "@/lib/mock-data";
import { useDemo } from "@/components/providers/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { MeetingFormat, StudyGroup } from "@/lib/types";

export function GroupsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus") ?? "";
  const { joinedGroupIds, joinGroup, createdGroups, createGroup } = useDemo();
  const [open, setOpen] = React.useState(false);
  const [createdMsg, setCreatedMsg] = React.useState<string | null>(null);
  const allGroups = React.useMemo(() => [...createdGroups, ...mockStudyGroups], [createdGroups]);
  const joinedGroups = allGroups.filter((g) => joinedGroupIds.includes(g.id));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
          <p className="mt-1 text-muted-foreground">GroupMe-style class squads with chat, details, and live planning.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="mr-1 h-4 w-4" />
              Create group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a study group</DialogTitle>
              <DialogDescription>
                This creates the group instantly, auto-joins you, and opens the full group detail page.
              </DialogDescription>
            </DialogHeader>
            <CreateGroupForm
              onDone={(group) => {
                const created = createGroup(group);
                setCreatedMsg(`“${created.title}” created. You are now the group owner.`);
                setOpen(false);
                router.push(`/groups/${created.id}`);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {createdMsg ? (
        <Card className="border-emerald-200 bg-emerald-50/80 shadow-none">
          <CardContent className="py-4 text-sm text-emerald-900">{createdMsg}</CardContent>
        </Card>
      ) : null}
      {focus ? (
        <p className="text-sm text-muted-foreground">
          Highlighting groups related to <span className="font-medium text-foreground">{focus}</span>.
        </p>
      ) : null}

      {joinedGroups.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Your groups</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {joinedGroups.map((g) => (
              <Card key={g.id} className="rounded-2xl border-white/80 bg-white/90 shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{g.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{g.schedule}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="success">Joined</Badge>
                  <Button asChild size="sm" className="rounded-full">
                    <Link href={`/groups/${g.id}`} className="gap-1.5">
                      Open details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {allGroups.map((g) => {
          const joined = joinedGroupIds.includes(g.id);
          const highlighted = focus && g.classTag.toLowerCase() === focus.toLowerCase();
          return (
            <Card
              key={g.id}
              className={cn(
                "rounded-2xl border-white/80 bg-white/90 shadow-soft transition-shadow",
                highlighted && "ring-2 ring-primary/30",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-lg">{g.title}</CardTitle>
                  <Badge variant="secondary">{g.classTag}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{g.schedule}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="font-normal">
                    {g.memberCount}/{g.maxMembers} members
                  </Badge>
                  <Badge variant="warning">{g.nextExam}</Badge>
                </div>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Goal:</span> {g.studyGoal}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Format:</span>{" "}
                  {g.format === "virtual" ? "Virtual" : g.format === "in-person" ? "In person" : "Flexible"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={joined}
                    onClick={() => {
                      joinGroup(g.id);
                      setCreatedMsg(`You joined “${g.title}”. Open group details to jump into chat.`);
                    }}
                  >
                    {joined ? "Joined" : "Join group"}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full" asChild>
                    <Link href={`/groups/${g.id}`}>Group details</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full" asChild>
                    <Link href={`/messages?group=${g.id}`}>Open inbox</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
          <Users className="h-8 w-8 opacity-40" />
          <p>After joining, open details to see members, pinned plan, and the group chat thread.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CreateGroupForm({ onDone }: { onDone: (group: Omit<StudyGroup, "id" | "memberCount">) => void }) {
  const [title, setTitle] = React.useState("CSEN 12 Weekend Lab");
  const [klass, setKlass] = React.useState("CSEN 12");
  const [schedule, setSchedule] = React.useState("Sat · 10am–12pm · Library north");
  const [goal, setGoal] = React.useState("Pair-debugging on assignment 4");
  const [maxMembers, setMaxMembers] = React.useState(8);
  const [nextExam, setNextExam] = React.useState("CSEN 12 Midterm — Apr 2");
  const [format, setFormat] = React.useState<MeetingFormat>("either");

  return (
    <form
      className="grid gap-4 py-2"
      onSubmit={(e) => {
        e.preventDefault();
        onDone({
          title,
          classTag: klass,
          maxMembers,
          nextExam,
          studyGoal: goal,
          schedule,
          format,
        });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="gt">Group title</Label>
        <Input id="gt" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gk">Class tag</Label>
        <Input id="gk" value={klass} onChange={(e) => setKlass(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gs">Schedule</Label>
        <Textarea id="gs" value={schedule} onChange={(e) => setSchedule(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ge">Next exam / milestone</Label>
        <Input id="ge" value={nextExam} onChange={(e) => setNextExam(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="gm">Max members</Label>
          <Input
            id="gm"
            type="number"
            min={3}
            max={20}
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value || 8))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gf">Format</Label>
          <select
            id="gf"
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value as MeetingFormat)}
          >
            <option value="in-person">In person</option>
            <option value="virtual">Virtual</option>
            <option value="either">Flexible</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gg">Study goal</Label>
        <Textarea id="gg" value={goal} onChange={(e) => setGoal(e.target.value)} />
      </div>
      <DialogFooter>
        <Button type="submit" className="rounded-full">Create group</Button>
      </DialogFooter>
    </form>
  );
}
