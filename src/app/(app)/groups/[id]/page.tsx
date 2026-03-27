"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarClock, ChevronLeft, Users } from "lucide-react";
import { mockStudents, mockStudyGroups } from "@/lib/mock-data";
import { useDemo } from "@/components/providers/demo-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";

export default function GroupDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const {
    profile,
    joinedGroupIds,
    joinGroup,
    createdGroups,
  } = useDemo();

  const allGroups = React.useMemo(() => [...createdGroups, ...mockStudyGroups], [createdGroups]);
  const group = allGroups.find((g) => g.id === id);
  const joined = joinedGroupIds.includes(id);

  if (!group) {
    return (
      <EmptyState
        icon={Users}
        title="Group not found"
        description="This group doesn't exist in the demo state."
        action={
          <Button asChild className="rounded-full">
            <Link href="/groups">Back to groups</Link>
          </Button>
        }
      />
    );
  }

  const memberCandidates = mockStudents.filter((s) =>
    s.classes.some((c) => c.toLowerCase() === group.classTag.toLowerCase()),
  );
  const members = memberCandidates.slice(0, Math.min(group.memberCount + 1, group.maxMembers));

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild className="rounded-full">
        <Link href="/groups" className="gap-1.5">
          <ChevronLeft className="h-4 w-4" />
          Back to groups
        </Link>
      </Button>

      <Card className="rounded-3xl border-white/80 bg-white/90 shadow-soft">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-2xl">{group.title}</CardTitle>
            <Badge variant="secondary">{group.classTag}</Badge>
            {joined ? <Badge variant="success">Joined</Badge> : null}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="h-4 w-4" />
              {group.memberCount}/{group.maxMembers} members
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-4 w-4" />
              {group.schedule}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{group.studyGoal}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="warning">{group.nextExam}</Badge>
            <Badge variant="outline">
              {group.format === "virtual"
                ? "Virtual"
                : group.format === "in-person"
                  ? "In person"
                  : "Flexible"}
            </Badge>
            {!joined ? (
              <Button size="sm" className="rounded-full" onClick={() => joinGroup(group.id)}>
                Join this group
              </Button>
            ) : null}
            <Button size="sm" variant="outline" className="rounded-full" asChild>
              <Link href={`/messages?group=${group.id}`}>Open in inbox</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="rounded-full">
          <TabsTrigger value="members" className="rounded-full">Members</TabsTrigger>
          <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="rounded-3xl border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">Members</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-2xl border bg-white p-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image src={m.avatarUrl} alt={m.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.major} · {m.year}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <Card className="rounded-3xl border-white/80 bg-white/90 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base">What happens next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1) Join group and use the main Inbox for all group chat.</p>
              <p>2) Share availability and lock the meetup window.</p>
              <p>3) Use pinned goal ({group.studyGoal}) to keep sessions focused.</p>
              <p>4) Revisit before {group.nextExam} to split topics and assignments.</p>
              <p className="pt-2 text-foreground">
                You: <span className="font-medium">{profile?.name ?? "Guest profile"}</span>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
