"use client";

import * as React from "react";
import type { ChatMessage, Conversation, DemoProfile, GroupChatMessage, Student, StudyGroup } from "@/lib/types";
import { defaultDemoProfile } from "@/lib/default-profile";
import { mockConversations, mockGroupMessages, mockInitialMessages } from "@/lib/mock-data";

const PROFILE_KEY = "csc-demo-profile";
const MESSAGES_KEY = "csc-demo-messages";
const GROUPS_KEY = "csc-demo-groups";
const CONV_KEY = "csc-demo-conversations";
const CREATED_GROUPS_KEY = "csc-demo-created-groups";
const GROUP_CHAT_KEY = "csc-demo-group-messages";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

type DemoContextValue = {
  profile: DemoProfile | null;
  setProfile: (p: DemoProfile | null) => void;
  ensureGuestProfile: () => void;
  conversations: Conversation[];
  ensureConversationWithPeer: (student: Student) => string;
  messagesByConversation: Record<string, ChatMessage[]>;
  sendMessage: (conversationId: string, text: string) => void;
  receiveMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  joinedGroupIds: string[];
  joinGroup: (groupId: string) => void;
  createdGroups: StudyGroup[];
  createGroup: (draft: Omit<StudyGroup, "id" | "memberCount">) => StudyGroup;
  groupMessagesByGroup: Record<string, GroupChatMessage[]>;
  sendGroupMessage: (groupId: string, text: string) => void;
  receiveGroupMessage: (groupId: string, text: string, senderName: string, senderAvatar?: string) => void;
};

const DemoContext = React.createContext<DemoContextValue | null>(null);

function cloneInitialMessages(): Record<string, ChatMessage[]> {
  return JSON.parse(JSON.stringify(mockInitialMessages)) as Record<string, ChatMessage[]>;
}

function cloneConversations(): Conversation[] {
  return JSON.parse(JSON.stringify(mockConversations)) as Conversation[];
}

function cloneGroupMessages(): Record<string, GroupChatMessage[]> {
  return JSON.parse(JSON.stringify(mockGroupMessages)) as Record<string, GroupChatMessage[]>;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = React.useState<DemoProfile | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>(() => cloneConversations());
  const [messagesByConversation, setMessages] = React.useState<Record<string, ChatMessage[]>>(() => cloneInitialMessages());
  const [joinedGroupIds, setJoinedGroupIds] = React.useState<string[]>([]);
  const [createdGroups, setCreatedGroups] = React.useState<StudyGroup[]>([]);
  const [groupMessagesByGroup, setGroupMessagesByGroup] = React.useState<Record<string, GroupChatMessage[]>>(() =>
    cloneGroupMessages(),
  );

  React.useEffect(() => {
    const savedProfile = loadJson<DemoProfile | null>(PROFILE_KEY, null);
    if (savedProfile) setProfileState(savedProfile);
    const savedMessages = loadJson<Record<string, ChatMessage[]> | null>(MESSAGES_KEY, null);
    if (savedMessages && Object.keys(savedMessages).length) setMessages(savedMessages);
    setJoinedGroupIds(loadJson<string[]>(GROUPS_KEY, []));
    const savedConv = loadJson<Conversation[] | null>(CONV_KEY, null);
    if (savedConv && savedConv.length) setConversations(savedConv);
    const savedCreated = loadJson<StudyGroup[] | null>(CREATED_GROUPS_KEY, null);
    if (savedCreated && savedCreated.length) setCreatedGroups(savedCreated);
    const savedGroupMessages = loadJson<Record<string, GroupChatMessage[]> | null>(GROUP_CHAT_KEY, null);
    if (savedGroupMessages && Object.keys(savedGroupMessages).length) setGroupMessagesByGroup(savedGroupMessages);
  }, []);

  const persistConv = React.useCallback((list: Conversation[]) => {
    if (typeof window !== "undefined") localStorage.setItem(CONV_KEY, JSON.stringify(list));
  }, []);

  const setProfile = React.useCallback((p: DemoProfile | null) => {
    setProfileState(p);
    if (typeof window === "undefined") return;
    if (p) localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    else localStorage.removeItem(PROFILE_KEY);
  }, []);

  const ensureGuestProfile = React.useCallback(() => {
    setProfileState((current) => {
      if (current) return current;
      const next = { ...defaultDemoProfile };
      if (typeof window !== "undefined") localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const ensureConversationWithPeer = React.useCallback(
    (student: Student) => {
      let found = "";
      setConversations((prev) => {
        const existing = prev.find((c) => c.peerId === student.id);
        if (existing) {
          found = existing.id;
          return prev;
        }
        const id = `cx-${student.id}`;
        found = id;
        const next: Conversation[] = [
          {
            id,
            peerId: student.id,
            peerName: student.name,
            peerAvatar: student.avatarUrl,
            lastPreview: "Start the conversation",
            unread: 0,
          },
          ...prev,
        ];
        persistConv(next);
        return next;
      });
      setMessages((prev) => {
        if (prev[found]?.length) return prev;
        const next = { ...prev, [found]: prev[found] ?? [] };
        if (typeof window !== "undefined") localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
        return next;
      });
      return found;
    },
    [persistConv],
  );

  const sendMessage = React.useCallback(
    (conversationId: string, text: string) => {
      const id = `local-${Date.now()}`;
      const now = new Date();
      const at = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setMessages((prev) => {
        const next = {
          ...prev,
          [conversationId]: [...(prev[conversationId] ?? []), { id, conversationId, fromMe: true, text, at }],
        };
        if (typeof window !== "undefined") localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
        return next;
      });
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conversationId ? { ...c, lastPreview: text, unread: 0 } : c,
        );
        persistConv(updated);
        return updated;
      });
    },
    [persistConv],
  );

  const receiveMessage = React.useCallback(
    (conversationId: string, text: string) => {
      const id = `peer-${Date.now()}`;
      const now = new Date();
      const at = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setMessages((prev) => {
        const next = {
          ...prev,
          [conversationId]: [...(prev[conversationId] ?? []), { id, conversationId, fromMe: false, text, at }],
        };
        if (typeof window !== "undefined") localStorage.setItem(MESSAGES_KEY, JSON.stringify(next));
        return next;
      });
      setConversations((prev) => {
        const updated = prev.map((c) =>
          c.id === conversationId ? { ...c, lastPreview: text, unread: c.unread + 1 } : c,
        );
        persistConv(updated);
        return updated;
      });
    },
    [persistConv],
  );

  const markConversationRead = React.useCallback(
    (conversationId: string) => {
      setConversations((prev) => {
        const target = prev.find((c) => c.id === conversationId);
        if (!target || target.unread === 0) return prev;
        const updated = prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c));
        persistConv(updated);
        return updated;
      });
    },
    [persistConv],
  );

  const joinGroup = React.useCallback((groupId: string) => {
    setJoinedGroupIds((prev) => {
      if (prev.includes(groupId)) return prev;
      const next = [...prev, groupId];
      if (typeof window !== "undefined") localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
      return next;
    });
    setGroupMessagesByGroup((prev) => {
      if (prev[groupId]?.length) return prev;
      const welcome: GroupChatMessage = {
        id: `welcome-${Date.now()}`,
        groupId,
        senderName: "System",
        senderAvatar: "",
        fromMe: false,
        text: "Welcome! Say hi and share what you want to work on this week.",
        at: "Now",
      };
      const next = { ...prev, [groupId]: [welcome] };
      if (typeof window !== "undefined") localStorage.setItem(GROUP_CHAT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const createGroup = React.useCallback((draft: Omit<StudyGroup, "id" | "memberCount">) => {
    const id = `gx-${Date.now()}`;
    const nextGroup: StudyGroup = {
      ...draft,
      id,
      memberCount: 1,
    };
    setCreatedGroups((prev) => {
      const next = [nextGroup, ...prev];
      if (typeof window !== "undefined") localStorage.setItem(CREATED_GROUPS_KEY, JSON.stringify(next));
      return next;
    });
    setJoinedGroupIds((prev) => {
      const next = prev.includes(id) ? prev : [id, ...prev];
      if (typeof window !== "undefined") localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
      return next;
    });
    setGroupMessagesByGroup((prev) => {
      const me = profile?.name || "You";
      const first: GroupChatMessage = {
        id: `gm-${Date.now()}`,
        groupId: id,
        senderName: me,
        senderAvatar: "",
        fromMe: true,
        text: `Welcome to ${draft.title}! Drop your availability and goals.`,
        at: "Now",
      };
      const next = { ...prev, [id]: [first] };
      if (typeof window !== "undefined") localStorage.setItem(GROUP_CHAT_KEY, JSON.stringify(next));
      return next;
    });
    return nextGroup;
  }, [profile?.name]);

  const sendGroupMessage = React.useCallback(
    (groupId: string, text: string) => {
      const id = `gm-local-${Date.now()}`;
      const now = new Date();
      const at = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      const me = profile?.name || "You";
      setGroupMessagesByGroup((prev) => {
        const next = {
          ...prev,
          [groupId]: [
            ...(prev[groupId] ?? []),
            {
              id,
              groupId,
              senderName: me,
              senderAvatar: "",
              fromMe: true,
              text,
              at,
            },
          ],
        };
        if (typeof window !== "undefined") localStorage.setItem(GROUP_CHAT_KEY, JSON.stringify(next));
        return next;
      });
    },
    [profile?.name],
  );

  const receiveGroupMessage = React.useCallback(
    (groupId: string, text: string, senderName: string, senderAvatar = "") => {
      const id = `gm-peer-${Date.now()}`;
      const now = new Date();
      const at = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      setGroupMessagesByGroup((prev) => {
        const next = {
          ...prev,
          [groupId]: [
            ...(prev[groupId] ?? []),
            {
              id,
              groupId,
              senderName,
              senderAvatar,
              fromMe: false,
              text,
              at,
            },
          ],
        };
        if (typeof window !== "undefined") localStorage.setItem(GROUP_CHAT_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const value = React.useMemo(
    () => ({
      profile,
      setProfile,
      ensureGuestProfile,
      conversations,
      ensureConversationWithPeer,
      messagesByConversation,
      sendMessage,
      receiveMessage,
      markConversationRead,
      joinedGroupIds,
      joinGroup,
      createdGroups,
      createGroup,
      groupMessagesByGroup,
      sendGroupMessage,
      receiveGroupMessage,
    }),
    [
      profile,
      setProfile,
      ensureGuestProfile,
      conversations,
      ensureConversationWithPeer,
      messagesByConversation,
      sendMessage,
      receiveMessage,
      markConversationRead,
      joinedGroupIds,
      joinGroup,
      createdGroups,
      createGroup,
      groupMessagesByGroup,
      sendGroupMessage,
      receiveGroupMessage,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = React.useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
