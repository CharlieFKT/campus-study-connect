"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, MessageCircle, RotateCcw, Star, X } from "lucide-react";
import { useDemo } from "@/components/providers/demo-context";
import { mockStudents } from "@/lib/mock-data";
import { computeCompatibility } from "@/lib/match-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Action = "like" | "pass" | "super";

const CLASS_OPTIONS = ["", "CSEN 12", "Calculus I", "Physics 1", "Intro to Psychology", "Economics", "Writing Seminar"];
const YEAR_OPTIONS = ["", "Freshman", "Sophomore", "Junior", "Senior"];
const MAJOR_OPTIONS = [
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

export function SwipeClient() {
  const { profile } = useDemo();
  const [index, setIndex] = React.useState(0);
  const [lastAction, setLastAction] = React.useState<Action | null>(null);
  const [likes, setLikes] = React.useState<string[]>([]);

  const [classTag, setClassTag] = React.useState("");
  const [year, setYear] = React.useState("");
  const [major, setMajor] = React.useState("");
  const [interest, setInterest] = React.useState("");

  const [dragX, setDragX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startXRef = React.useRef(0);
  const pointerIdRef = React.useRef<number | null>(null);

  const deck = React.useMemo(() => {
    return [...mockStudents]
      .filter((s) => {
        if (classTag && !s.classes.some((c) => c.toLowerCase() === classTag.toLowerCase())) return false;
        if (year && s.year !== year) return false;
        if (major && s.major !== major) return false;
        if (interest && !s.interests.some((i) => i.toLowerCase().includes(interest.toLowerCase()))) return false;
        return true;
      })
      .map((s) => ({ s, score: computeCompatibility(profile, s).score }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.s);
  }, [profile, classTag, year, major, interest]);

  React.useEffect(() => {
    setIndex(0);
  }, [classTag, year, major, interest]);

  const current = deck[index];

  const act = React.useCallback((action: Action) => {
    if (!current) return;
    setLastAction(action);
    if (action === "like" || action === "super") {
      setLikes((prev) => (prev.includes(current.id) ? prev : [...prev, current.id]));
    }
    setTimeout(() => {
      setIndex((i) => i + 1);
      setLastAction(null);
      setDragX(0);
    }, 170);
  }, [current]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!current) return;
      if (e.key === "ArrowLeft") act("pass");
      if (e.key === "ArrowRight") act("like");
      if (e.key === "ArrowUp") act("super");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, act]);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!current) return;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || pointerIdRef.current !== e.pointerId) return;
    const delta = e.clientX - startXRef.current;
    setDragX(delta);
  }

  function handlePointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== e.pointerId) return;
    setIsDragging(false);
    const threshold = 110;
    if (dragX > threshold) {
      act("like");
    } else if (dragX < -threshold) {
      act("pass");
    } else {
      setDragX(0);
    }
    pointerIdRef.current = null;
  }

  function resetFilters() {
    setClassTag("");
    setYear("");
    setMajor("");
    setInterest("");
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <FilterBar
          classTag={classTag}
          setClassTag={setClassTag}
          year={year}
          setYear={setYear}
          major={major}
          setMajor={setMajor}
          interest={interest}
          setInterest={setInterest}
          resetFilters={resetFilters}
        />
        <Card className="mx-auto max-w-xl rounded-3xl shadow-card">
          <CardContent className="space-y-4 p-8 text-center">
            <h1 className="text-2xl font-semibold">No more people in this filter</h1>
            <p className="text-muted-foreground">
              You liked {likes.length} people. Change your filters or restart this deck.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => setIndex(0)} className="rounded-full">
                Restart deck
              </Button>
              <Button variant="outline" onClick={resetFilters} className="rounded-full">
                Clear filters
              </Button>
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/messages">Open chats</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { score, reasons } = computeCompatibility(profile, current);
  const rotate = Math.max(-16, Math.min(16, dragX / 12));
  const likeOpacity = Math.max(0, dragX / 90);
  const passOpacity = Math.max(0, -dragX / 90);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Swipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">Drag card right to like, left to pass. (Up arrow = super like)</p>
      </div>

      <FilterBar
        classTag={classTag}
        setClassTag={setClassTag}
        year={year}
        setYear={setYear}
        major={major}
        setMajor={setMajor}
        interest={interest}
        setInterest={setInterest}
        resetFilters={resetFilters}
      />

      <div className="relative mx-auto max-w-xl">
        <Card
          className="relative touch-pan-y select-none overflow-hidden rounded-3xl shadow-card transition-transform duration-150"
          style={{ transform: `translateX(${dragX}px) rotate(${rotate}deg)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
        >
          <div className="relative aspect-[4/5]">
            <Image src={current.avatarUrl} alt={current.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 500px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

            <div
              className="absolute left-4 top-4 rounded-full border-2 border-emerald-300 bg-emerald-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900"
              style={{ opacity: likeOpacity }}
            >
              Like
            </div>
            <div
              className="absolute right-4 top-4 rounded-full border-2 border-rose-300 bg-rose-100/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-900"
              style={{ opacity: passOpacity }}
            >
              Pass
            </div>

            {lastAction ? (
              <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                {lastAction === "like" ? "Liked" : lastAction === "super" ? "Super liked" : "Passed"}
              </div>
            ) : null}

            <div className="absolute bottom-0 w-full space-y-3 p-5 text-white">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{current.name}</h2>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{current.year}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{score}% vibe</span>
              </div>
              <p className="text-sm text-white/90">{current.major}</p>
              <p className="line-clamp-2 text-sm text-white/90">{current.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {current.classes.slice(0, 3).map((c) => (
                  <Badge key={c} className="bg-white/20 text-white hover:bg-white/20">
                    {c}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {reasons.slice(0, 2).map((r) => (
                  <span key={r} className="rounded-full bg-white/15 px-2 py-0.5 text-xs text-white/90">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button size="icon" variant="outline" className="h-14 w-14 rounded-full border-2" onClick={() => act("pass")}>
          <X className="h-6 w-6 text-rose-500" />
        </Button>
        <Button size="icon" className="h-16 w-16 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500" onClick={() => act("like")}>
          <Heart className="h-7 w-7" />
        </Button>
        <Button size="icon" variant="outline" className="h-14 w-14 rounded-full border-2" onClick={() => act("super")}>
          <Star className="h-6 w-6 text-violet-500" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1">
          <Flame className="h-3.5 w-3.5" /> {index + 1}/{deck.length}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1">
          <Heart className="h-3.5 w-3.5" /> {likes.length} liked
        </span>
        <Link href="/messages" className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-primary hover:underline">
          <MessageCircle className="h-3.5 w-3.5" /> open chats
        </Link>
      </div>
    </div>
  );
}

function FilterBar({
  classTag,
  setClassTag,
  year,
  setYear,
  major,
  setMajor,
  interest,
  setInterest,
  resetFilters,
}: {
  classTag: string;
  setClassTag: (v: string) => void;
  year: string;
  setYear: (v: string) => void;
  major: string;
  setMajor: (v: string) => void;
  interest: string;
  setInterest: (v: string) => void;
  resetFilters: () => void;
}) {
  return (
    <Card className="rounded-3xl border-white/80 bg-white/80 shadow-soft">
      <CardContent className="grid gap-3 p-4 md:grid-cols-4">
        <select
          className="h-10 rounded-full border border-input bg-white px-3 text-sm"
          value={classTag}
          onChange={(e) => setClassTag(e.target.value)}
        >
          {CLASS_OPTIONS.map((v) => (
            <option key={v || "any-class"} value={v}>
              {v || "Any class"}
            </option>
          ))}
        </select>

        <select className="h-10 rounded-full border border-input bg-white px-3 text-sm" value={major} onChange={(e) => setMajor(e.target.value)}>
          {MAJOR_OPTIONS.map((v) => (
            <option key={v || "any-major"} value={v}>
              {v || "Any major"}
            </option>
          ))}
        </select>

        <select className="h-10 rounded-full border border-input bg-white px-3 text-sm" value={year} onChange={(e) => setYear(e.target.value)}>
          {YEAR_OPTIONS.map((v) => (
            <option key={v || "any-year"} value={v}>
              {v || "Any year"}
            </option>
          ))}
        </select>

        <Input
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Interest (music, gym…)"
          className="rounded-full"
        />

        <div className="md:col-span-4 flex justify-end">
          <Button variant="outline" size="sm" className="rounded-full" onClick={resetFilters}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
