import type { DemoProfile } from "./types";
import { DEMO_SCHOOL } from "./mock-data";

export const defaultDemoProfile: DemoProfile = {
  name: "Alex Rivera",
  major: "Computer Science",
  year: "Sophomore",
  bio: "Building habits for CS + math. Prefer structured sessions and clear agendas.",
  classes: ["CSEN 12", "Calculus I", "Writing Seminar"],
  exams: [{ name: "CSEN 12 Midterm", dateLabel: "Apr 2" }],
  studyGoals: ["Arrays & loops mastery", "Stay ahead on p-sets"],
  interests: ["Campus bike co-op", "Indie playlists", "LATTE art (badly)"],
  lookingFor: "both",
  studyStyle: "problem-solving",
  availability: ["Mon/Wed evenings", "Sat mornings"],
  meetingFormat: "either",
};

export const defaultDemoSchool = DEMO_SCHOOL;
