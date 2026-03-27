"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDemo } from "@/components/providers/demo-context";
import type { DemoProfile, MeetingFormat, StudyLookingFor, StudyStyle } from "@/lib/types";
import { DEMO_SCHOOL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const MAJORS = [
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
];

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"];

const CLASS_SUGGESTIONS = [
  "CSEN 12",
  "Calculus I",
  "Physics 1",
  "Intro to Psychology",
  "Economics",
  "Writing Seminar",
];

const TOTAL_STEPS = 5;

export function OnboardingWizard() {
  const router = useRouter();
  const { setProfile } = useDemo();
  const [step, setStep] = React.useState(1);
  const [emailSent, setEmailSent] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [major, setMajor] = React.useState("Computer Science");
  const [year, setYear] = React.useState("Sophomore");
  const [bio, setBio] = React.useState("");

  const [classesText, setClassesText] = React.useState("CSEN 12, Calculus I");
  const [examName, setExamName] = React.useState("CSEN 12 Midterm");
  const [examWhen, setExamWhen] = React.useState("Apr 2");
  const [goalsText, setGoalsText] = React.useState("Arrays & loops, stay ahead on p-sets");

  const [lookingFor, setLookingFor] = React.useState<StudyLookingFor>("both");
  const [studyStyle, setStudyStyle] = React.useState<StudyStyle>("problem-solving");
  const [availabilityText, setAvailabilityText] = React.useState("Mon/Wed evenings, Sat mornings");
  const [meetingFormat, setMeetingFormat] = React.useState<MeetingFormat>("either");

  const [interestsText, setInterestsText] = React.useState("Coffee shops, indie playlists, campus clubs");

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  function parseList(s: string) {
    return s
      .split(/[,;\n]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function buildProfile(): DemoProfile {
    return {
      name: name || "Alex Rivera",
      major,
      year,
      bio: bio || "Excited to find focused study partners on campus.",
      classes: parseList(classesText).length ? parseList(classesText) : ["CSEN 12", "Calculus I"],
      exams: [{ name: examName || "Midterm", dateLabel: examWhen || "TBD" }],
      studyGoals: parseList(goalsText).length ? parseList(goalsText) : ["Keep up with coursework"],
      interests: parseList(interestsText).length ? parseList(interestsText) : [],
      lookingFor,
      studyStyle,
      availability: parseList(availabilityText),
      meetingFormat,
    };
  }

  function canNext(): boolean {
    if (step === 1) return email.includes("@") && emailSent;
    if (step === 2) return name.trim().length > 1;
    if (step === 3) return parseList(classesText).length > 0;
    return true;
  }

  function finish() {
    setProfile(buildProfile());
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <div className="mb-8 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">Pacific Crest · Demo onboarding</p>
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">
              {step === 1 && "Verify your school email"}
              {step === 2 && "Basic profile"}
              {step === 3 && "Academic focus"}
              {step === 4 && "Study preferences"}
              {step === 5 && "Interests & finish"}
            </CardTitle>
            <CardDescription>
              {step === 1 && `We only allow ${DEMO_SCHOOL} addresses in this pilot (simulated for the demo).`}
              {step === 2 && "How you show up to classmates — keep it professional and specific."}
              {step === 3 && "Classes and exams power your compatibility — add what you’re actually taking."}
              {step === 4 && "Set expectations up front so matches feel intentional, not random."}
              {step === 5 && "Optional flavor — helps break the ice around campus life."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">School email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@pacificcrest.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Demo tip: use any address containing <span className="font-medium">pacificcrest</span>.
                  </p>
                </div>
                {!emailSent ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full gap-2"
                    disabled={!email.includes("@")}
                    onClick={() => setEmailSent(true)}
                  >
                    <Mail className="h-4 w-4" />
                    Send verification (demo)
                  </Button>
                ) : (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-900">
                    <div className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4" />
                      Verified for demo
                    </div>
                    <p className="mt-1 text-emerald-800/90">No real email is sent — this step simulates campus gating.</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Preferred name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Lee" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <select
                      id="major"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                    >
                      {MAJORS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <select
                      id="year"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Short bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="How do you like to study? What are you optimizing for this term?"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="classes">Classes (comma-separated)</Label>
                  <Textarea id="classes" value={classesText} onChange={(e) => setClassesText(e.target.value)} />
                  <div className="flex flex-wrap gap-1.5">
                    {CLASS_SUGGESTIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setClassesText((t) => (t.includes(c) ? t : t.trim() ? `${t}, ${c}` : c))
                        }
                        className="rounded-full border bg-white px-2.5 py-0.5 text-xs text-muted-foreground hover:border-primary/40"
                      >
                        + {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="exam">Next exam name</Label>
                    <Input id="exam" value={examName} onChange={(e) => setExamName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examwhen">Date (label)</Label>
                    <Input id="examwhen" value={examWhen} onChange={(e) => setExamWhen(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goals">Study goals (comma-separated)</Label>
                  <Textarea id="goals" value={goalsText} onChange={(e) => setGoalsText(e.target.value)} />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Looking for</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(
                      [
                        ["partner", "Study partner"],
                        ["group", "Study group"],
                        ["both", "Either"],
                      ] as const
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setLookingFor(val)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          lookingFor === val ? "border-primary bg-primary/5" : "bg-white hover:bg-muted/40",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Study style</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(
                      [
                        ["quiet", "Quiet deep work"],
                        ["discussion", "Discussion-based"],
                        ["problem-solving", "Problem-solving"],
                        ["accountability", "Accountability check-ins"],
                      ] as const
                    ).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setStudyStyle(val)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                          studyStyle === val ? "border-primary bg-primary/5" : "bg-white hover:bg-muted/40",
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avail">Typical availability</Label>
                  <Textarea
                    id="avail"
                    value={availabilityText}
                    onChange={(e) => setAvailabilityText(e.target.value)}
                    placeholder="e.g. Mon/Wed after 4pm, Sunday library blocks"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meeting format</Label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["in-person", "In person"],
                        ["virtual", "Virtual"],
                        ["either", "Flexible"],
                      ] as const
                    ).map(([val, label]) => (
                      <Button
                        key={val}
                        type="button"
                        size="sm"
                        variant={meetingFormat === val ? "default" : "outline"}
                        onClick={() => setMeetingFormat(val)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="interests">Hobbies & interests (comma-separated)</Label>
                  <Textarea
                    id="interests"
                    value={interestsText}
                    onChange={(e) => setInterestsText(e.target.value)}
                    placeholder="Clubs, sports, creative stuff — keep it light."
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="text-sm font-medium">Profile preview</p>
                  <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{name || "Your name"}</span>
                      <Badge variant="secondary">{major}</Badge>
                      <Badge variant="outline">{year}</Badge>
                    </div>
                    <p className="mt-2 text-muted-foreground">{bio || "Your bio will show here."}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {parseList(classesText).map((c) => (
                        <span key={c} className="rounded-md bg-white px-2 py-0.5 text-xs shadow-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-2 border-t bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              disabled={step <= 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Previous
            </Button>
            {step < TOTAL_STEPS ? (
              <Button type="button" className="gap-2" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" className="gap-2" onClick={finish}>
                Save & go to home
                <Check className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
