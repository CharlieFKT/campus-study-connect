export type StudyLookingFor = "partner" | "group" | "both";

export type StudyStyle = "quiet" | "discussion" | "problem-solving" | "accountability";

export type MeetingFormat = "in-person" | "virtual" | "either";

export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  major: string;
  year: string;
  school: string;
  bio: string;
  classes: string[];
  exams: { name: string; dateLabel: string }[];
  studyGoals: string[];
  interests: string[];
  studyStyle: StudyStyle;
  availability: string[];
  meetingFormat: MeetingFormat;
  lookingFor: StudyLookingFor;
  activeThisWeek: boolean;
  lookingThisWeek: boolean;
  /** 0-100 for demo */
  compatibilityHint?: number;
}

export interface StudyGroup {
  id: string;
  title: string;
  classTag: string;
  memberCount: number;
  maxMembers: number;
  nextExam: string;
  studyGoal: string;
  schedule: string;
  format: MeetingFormat;
}

export interface DemoProfile {
  name: string;
  major: string;
  year: string;
  bio: string;
  classes: string[];
  exams: { name: string; dateLabel: string }[];
  studyGoals: string[];
  interests: string[];
  lookingFor: StudyLookingFor;
  studyStyle: StudyStyle;
  availability: string[];
  meetingFormat: MeetingFormat;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  fromMe: boolean;
  text: string;
  at: string;
}

export interface Conversation {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  lastPreview: string;
  unread: number;
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  senderName: string;
  senderAvatar: string;
  fromMe: boolean;
  text: string;
  at: string;
}
