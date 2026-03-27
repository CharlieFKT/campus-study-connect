import type { MeetingFormat, Student, StudyStyle } from "./types";

export type DiscoverFilters = {
  query: string;
  classTag: string;
  major: string;
  year: string;
  exam: string;
  studyStyle: StudyStyle | "";
  availability: string;
  interest: string;
  format: MeetingFormat | "";
};

export const emptyDiscoverFilters: DiscoverFilters = {
  query: "",
  classTag: "",
  major: "",
  year: "",
  exam: "",
  studyStyle: "",
  availability: "",
  interest: "",
  format: "",
};

export function filterStudents(list: Student[], f: DiscoverFilters): Student[] {
  return list.filter((s) => {
    if (f.query) {
      const q = f.query.toLowerCase();
      const hay = `${s.name} ${s.bio} ${s.major} ${s.classes.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.classTag && !s.classes.some((c) => c.toLowerCase() === f.classTag.toLowerCase())) return false;
    if (f.major && s.major !== f.major) return false;
    if (f.year && s.year !== f.year) return false;
    if (f.exam && !s.exams.some((e) => e.name.toLowerCase().includes(f.exam.toLowerCase()))) return false;
    if (f.studyStyle && s.studyStyle !== f.studyStyle) return false;
    if (f.availability) {
      const ok = s.availability.some((a) => a.toLowerCase().includes(f.availability.toLowerCase()));
      if (!ok) return false;
    }
    if (f.interest && !s.interests.some((i) => i.toLowerCase().includes(f.interest.toLowerCase()))) return false;
    if (f.format && f.format !== "either") {
      if (f.format === "virtual" && s.meetingFormat !== "virtual" && s.meetingFormat !== "either") return false;
      if (f.format === "in-person" && s.meetingFormat !== "in-person" && s.meetingFormat !== "either") return false;
    }
    return true;
  });
}
