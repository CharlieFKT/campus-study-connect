"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { useDemo } from "@/components/providers/demo-context";
import { mockStudents } from "@/lib/mock-data";
import { emptyDiscoverFilters, filterStudents, type DiscoverFilters } from "@/lib/filters";
import type { MeetingFormat, StudyStyle } from "@/lib/types";
import { StudentMatchCard } from "@/components/student/student-match-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/empty-state";

function useGuestProfile() {
  const { profile, ensureGuestProfile } = useDemo();
  React.useEffect(() => {
    ensureGuestProfile();
  }, [ensureGuestProfile]);
  return profile;
}

const CLASS_OPTIONS = [
  "",
  "CSEN 12",
  "Calculus I",
  "Physics 1",
  "Intro to Psychology",
  "Economics",
  "Writing Seminar",
];

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

export function DiscoverClient() {
  const searchParams = useSearchParams();
  const profile = useGuestProfile();
  const [filters, setFilters] = React.useState<DiscoverFilters>(() => ({
    ...emptyDiscoverFilters,
    query: searchParams.get("q") ?? "",
  }));

  React.useEffect(() => {
    const q = searchParams.get("q");
    if (q != null) setFilters((f) => ({ ...f, query: q }));
  }, [searchParams]);

  const results = React.useMemo(() => filterStudents(mockStudents, filters), [filters]);

  function set<K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Discover people</h1>
        <p className="mt-1 text-muted-foreground">
          Filter by classes, interests, vibe, and timing to find your people.
        </p>
      </div>

      <Card className="shadow-soft">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="q">Search</Label>
              <Input id="q" value={filters.query} onChange={(e) => set("query", e.target.value)} placeholder="Name, keyword, class…" />
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                value={filters.classTag}
                onChange={(e) => set("classTag", e.target.value)}
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c || "any"} value={c}>
                    {c || "Any class"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Major</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                value={filters.major}
                onChange={(e) => set("major", e.target.value)}
              >
                {MAJORS.map((m) => (
                  <option key={m || "any"} value={m}>
                    {m || "Any major"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                value={filters.year}
                onChange={(e) => set("year", e.target.value)}
              >
                {YEARS.map((y) => (
                  <option key={y || "any"} value={y}>
                    {y || "Any year"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam">Exam contains</Label>
              <Input
                id="exam"
                value={filters.exam}
                onChange={(e) => set("exam", e.target.value)}
                placeholder="e.g. midterm, CSEN"
              />
            </div>
            <div className="space-y-2">
              <Label>Study style</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                value={filters.studyStyle}
                onChange={(e) => set("studyStyle", e.target.value as StudyStyle | "")}
              >
                <option value="">Any</option>
                <option value="quiet">Quiet</option>
                <option value="discussion">Discussion-based</option>
                <option value="problem-solving">Problem-solving</option>
                <option value="accountability">Accountability</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avail">Availability contains</Label>
              <Input
                id="avail"
                value={filters.availability}
                onChange={(e) => set("availability", e.target.value)}
                placeholder="evening, weekend…"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest">Interest contains</Label>
              <Input
                id="interest"
                value={filters.interest}
                onChange={(e) => set("interest", e.target.value)}
                placeholder="chess, running…"
              />
            </div>
            <div className="space-y-2">
              <Label>Meeting format</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                value={filters.format}
                onChange={(e) => set("format", e.target.value as MeetingFormat | "")}
              >
                <option value="">Any</option>
                <option value="in-person">In person</option>
                <option value="virtual">Virtual</option>
                <option value="either">Either / flexible</option>
              </select>
            </div>
          </div>
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={() => setFilters({ ...emptyDiscoverFilters })}>
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {results.length ? (
          results.map((s) => <StudentMatchCard key={s.id} student={s} viewer={profile} />)
        ) : (
          <EmptyState
            icon={Filter}
            title="No matches for those filters"
            description="Loosen a constraint or reset — the demo roster is finite but diverse."
            action={
              <Button type="button" onClick={() => setFilters({ ...emptyDiscoverFilters })}>
                Reset filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
