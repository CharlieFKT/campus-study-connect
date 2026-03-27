"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Search as SearchIcon, Filter as FilterIcon } from "lucide-react";
import { useDemo } from "@/components/providers/demo-context";
import { mockStudyGroups, mockStudents } from "@/lib/mock-data";
import { computeCompatibility } from "@/lib/match-utils";
import { StudentMatchCard } from "@/components/student/student-match-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import type { DiscoverFilters } from "@/lib/filters";
import { emptyDiscoverFilters, filterStudents } from "@/lib/filters";
import type { MeetingFormat, Student, StudyStyle } from "@/lib/types";

const CLASS_OPTIONS = ["", "CSEN 12", "Calculus I", "Physics 1", "Intro to Psychology", "Economics", "Writing Seminar"];
const MAJORS = [
  "",
  "Computer Science",
  "Psychology",
  "Economics",
  "Mechanical Engineering",
  "Physics",
  "English",
  "Biology",
  "Mathematics",
  "Chemistry",
  "Undeclared",
  "Cognitive Science",
  "Biochemistry",
  "Statistics",
  "Philosophy",
  "Public Health",
  "Environmental Science",
];
const YEARS = ["", "Freshman", "Sophomore", "Junior", "Senior"];

export default function DashboardPage() {
  const { profile, ensureGuestProfile } = useDemo();
  const [filters, setFilters] = React.useState<DiscoverFilters>(emptyDiscoverFilters);

  React.useEffect(() => {
    ensureGuestProfile();
  }, [ensureGuestProfile]);

  const viewer = profile;

  const ranked: { student: Student; score: number }[] = React.useMemo(() => {
    return mockStudents
      .map((s) => ({ student: s, score: computeCompatibility(viewer, s).score }))
      .sort((a, b) => b.score - a.score);
  }, [viewer]);

  const topPicks = ranked.slice(0, 5).map((r) => r.student);
  const exploreResults = React.useMemo(() => filterStudents(mockStudents, filters), [filters]);

  const classGroups = mockStudyGroups.filter((g) =>
    viewer?.classes.some((c) => c.toLowerCase() === g.classTag.toLowerCase()),
  );

  const active = mockStudents.filter((s) => s.activeThisWeek || s.lookingThisWeek);

  function set<K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-soft sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Hey{viewer?.name ? ` ${viewer.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            One page for everything: top picks, filters, groups, and who&apos;s active now.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild className="rounded-full">
            <Link href="/swipe">Open swipe</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="rounded-full">
            <Link href="/onboarding">Edit profile</Link>
          </Button>
        </div>
      </div>

      <section className="space-y-3 rounded-3xl border border-white/70 bg-white/75 p-4">
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Explore people</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Input
              value={filters.query}
              onChange={(e) => set("query", e.target.value)}
              placeholder="Search name, major, class, interest..."
              className="rounded-full"
            />
          </div>
          <select className="h-10 rounded-full border border-input bg-white px-3 text-sm" value={filters.classTag} onChange={(e) => set("classTag", e.target.value)}>
            {CLASS_OPTIONS.map((v) => (
              <option key={v || "any-class"} value={v}>{v || "Any class"}</option>
            ))}
          </select>
          <select className="h-10 rounded-full border border-input bg-white px-3 text-sm" value={filters.major} onChange={(e) => set("major", e.target.value)}>
            {MAJORS.map((v) => (
              <option key={v || "any-major"} value={v}>{v || "Any major"}</option>
            ))}
          </select>
          <select className="h-10 rounded-full border border-input bg-white px-3 text-sm" value={filters.year} onChange={(e) => set("year", e.target.value)}>
            {YEARS.map((v) => (
              <option key={v || "any-year"} value={v}>{v || "Any year"}</option>
            ))}
          </select>
          <select
            className="h-10 rounded-full border border-input bg-white px-3 text-sm"
            value={filters.studyStyle}
            onChange={(e) => set("studyStyle", e.target.value as StudyStyle | "")}
          >
            <option value="">Any style</option>
            <option value="quiet">Quiet</option>
            <option value="discussion">Discussion</option>
            <option value="problem-solving">Problem-solving</option>
            <option value="accountability">Accountability</option>
          </select>
          <select
            className="h-10 rounded-full border border-input bg-white px-3 text-sm"
            value={filters.format}
            onChange={(e) => set("format", e.target.value as MeetingFormat | "")}
          >
            <option value="">Any format</option>
            <option value="in-person">In person</option>
            <option value="virtual">Virtual</option>
            <option value="either">Either</option>
          </select>
          <Input
            value={filters.interest}
            onChange={(e) => set("interest", e.target.value)}
            placeholder="Interest (music, gym...)"
            className="rounded-full"
          />
          <div className="flex items-center justify-end">
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => setFilters(emptyDiscoverFilters)}>
              Reset
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SearchIcon className="h-4 w-4" /> {exploreResults.length} people match your filters
        </div>

        <div className="grid gap-4">
          {exploreResults.slice(0, 8).map((s) => (
            <StudentMatchCard key={s.id} student={s} viewer={viewer} />
          ))}
          {!exploreResults.length ? (
            <EmptyState
              icon={SearchIcon}
              title="No matches yet"
              description="Try loosening a filter or reset to explore everyone on campus."
              action={
                <Button onClick={() => setFilters(emptyDiscoverFilters)} className="rounded-full">
                  Reset filters
                </Button>
              }
            />
          ) : null}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/70 bg-white/75 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Top picks for you</h2>
        </div>
        <div className="grid gap-4">
          {topPicks.map((s) => (
            <StudentMatchCard key={s.id} student={s} viewer={viewer} />
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-3xl border border-white/70 bg-white/75 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Groups near your classes</h2>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link href="/groups">View all</Link>
          </Button>
        </div>
        {classGroups.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {classGroups.map((g) => (
              <Card key={g.id} className="rounded-2xl shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{g.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {g.schedule} · {g.format === "virtual" ? "Virtual" : g.format === "in-person" ? "In person" : "Hybrid"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{g.memberCount}/{g.maxMembers} members</Badge>
                    <Badge variant="warning">{g.nextExam}</Badge>
                  </div>
                  <p className="text-muted-foreground">{g.studyGoal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No group matches yet"
            description="Join or create one from the groups page."
            action={
              <Button asChild className="rounded-full">
                <Link href="/groups">Open groups</Link>
              </Button>
            }
          />
        )}
      </section>

      <section className="space-y-3 rounded-3xl border border-white/70 bg-white/75 p-4">
        <h2 className="text-lg font-semibold">Active now</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {active.slice(0, 6).map((s) => (
            <StudentMatchCard key={s.id} student={s} viewer={viewer} />
          ))}
        </div>
      </section>
    </div>
  );
}
