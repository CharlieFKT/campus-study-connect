import type { DemoProfile, Student } from "./types";

export interface CompatibilityResult {
  score: number;
  reasons: string[];
}

function sharedClasses(a: string[], b: string[]) {
  const set = new Set(a.map((c) => c.toLowerCase()));
  return b.filter((c) => set.has(c.toLowerCase()));
}

function sharedExams(a: Student["exams"], b: Student["exams"]) {
  const names = new Set(a.map((e) => e.name.toLowerCase()));
  return b.filter((e) => names.has(e.name.toLowerCase()));
}

export function computeCompatibility(
  viewer: DemoProfile | null,
  student: Student,
): CompatibilityResult {
  if (!viewer) {
    return {
      score: 68 + (student.id.charCodeAt(1) % 20),
      reasons: ["Active on campus", "Similar course load (demo fallback)"],
    };
  }

  const reasons: string[] = [];
  let score = 42;

  const classes = sharedClasses(viewer.classes, student.classes);
  if (classes.length) {
    score += Math.min(18, classes.length * 9);
    reasons.push(
      classes.length > 1
        ? `Shared classes: ${classes.slice(0, 2).join(", ")}`
        : `Same class (${classes[0]})`,
    );
  }

  const exams = sharedExams(viewer.exams, student.exams);
  if (exams.length) {
    score += 12;
    reasons.push(`Same exam focus (${exams[0].name})`);
  }

  const goalOverlap = viewer.studyGoals.filter((g) =>
    student.studyGoals.some((sg) => sg.toLowerCase().includes(g.slice(0, 6).toLowerCase()) || g.toLowerCase().includes(sg.slice(0, 6).toLowerCase())),
  );
  if (goalOverlap.length) {
    score += 10;
    reasons.push("Similar study goals");
  } else if (viewer.studyGoals.length && student.studyGoals.length) {
    score += 4;
    reasons.push("Overlapping academic focus");
  }

  if (viewer.major === student.major) {
    score += 8;
    reasons.push("Same major");
  }

  if (viewer.year === student.year) {
    score += 5;
    reasons.push("Same year");
  }

  if (viewer.studyStyle === student.studyStyle) {
    score += 6;
    reasons.push("Matching study style");
  }

  const availOverlap = viewer.availability.some((v) =>
    student.availability.some((sv) => v.toLowerCase().includes("evening") && sv.toLowerCase().includes("evening")),
  );
  if (availOverlap) {
    score += 5;
    reasons.push("Matching evening schedule");
  }

  const interestOverlap = viewer.interests.filter((i) => student.interests.includes(i));
  if (interestOverlap.length) {
    score += Math.min(8, interestOverlap.length * 4);
    reasons.push("Shared interests");
  }

  if (viewer.meetingFormat === student.meetingFormat || viewer.meetingFormat === "either" || student.meetingFormat === "either") {
    score += 3;
    reasons.push("Compatible meeting format");
  }

  if (!reasons.length) {
    reasons.push("Nearby cohort at Pacific Crest");
  }

  score = Math.min(97, Math.max(48, Math.round(score)));

  const urgency = student.exams.some((e) => {
    const d = e.dateLabel.toLowerCase();
    return d.includes("mar") || d.includes("apr");
  });
  if (urgency && exams.length) {
    reasons.unshift("Exam coming soon — aligned prep window");
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 5) };
}

export function examUrgencyBadge(student: Student): string | null {
  const next = student.exams[0];
  if (!next) return null;
  if (next.dateLabel.includes("Mar") || next.dateLabel.includes("Apr")) {
    return `Exam: ${next.dateLabel}`;
  }
  return null;
}
