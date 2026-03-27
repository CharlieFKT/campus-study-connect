"use client";

import * as React from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Hash, Paperclip, Phone, Search, Send, Smile, Video } from "lucide-react";
import { useDemo } from "@/components/providers/demo-context";
import { getStudentById, mockStudyGroups } from "@/lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StudyGroup } from "@/lib/types";

type ThreadKind = "dm" | "group";
type ThreadItem = {
  key: string;
  kind: ThreadKind;
  id: string;
  name: string;
  avatar?: string;
  subtitle?: string;
  preview: string;
  unread: number;
  lastAtSort: number;
};

export function MessagesClient() {
  const searchParams = useSearchParams();
  const withId = searchParams.get("with");
  const groupIdParam = searchParams.get("group");
  const {
    conversations,
    messagesByConversation,
    sendMessage,
    receiveMessage,
    markConversationRead,
    ensureConversationWithPeer,
    joinedGroupIds,
    createdGroups,
    groupMessagesByGroup,
    sendGroupMessage,
    receiveGroupMessage,
    profile,
  } = useDemo();
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "dm" | "group">("all");
  const [typingFor, setTypingFor] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (withId) {
      const s = getStudentById(withId);
      if (s) {
        const id = ensureConversationWithPeer(s);
        setActiveKey(`dm:${id}`);
      }
    }
  }, [withId, ensureConversationWithPeer]);

  React.useEffect(() => {
    if (groupIdParam) {
      setActiveKey(`group:${groupIdParam}`);
    }
  }, [groupIdParam]);

  const allGroups = React.useMemo<StudyGroup[]>(
    () => [...createdGroups, ...mockStudyGroups].filter((g) => joinedGroupIds.includes(g.id)),
    [createdGroups, joinedGroupIds],
  );
  const groupById = React.useMemo(() => new Map(allGroups.map((g) => [g.id, g])), [allGroups]);

  const threads = React.useMemo<ThreadItem[]>(() => {
    const dmThreads: ThreadItem[] = conversations.map((c, idx) => {
      const msgs = messagesByConversation[c.id] ?? [];
      return {
        key: `dm:${c.id}`,
        kind: "dm",
        id: c.id,
        name: c.peerName,
        avatar: c.peerAvatar,
        subtitle: "Direct message",
        preview: msgs.at(-1)?.text ?? c.lastPreview,
        unread: c.unread,
        lastAtSort: msgs.length + 1000 - idx,
      };
    });
    const groupThreads: ThreadItem[] = allGroups.map((g, idx) => {
      const msgs = groupMessagesByGroup[g.id] ?? [];
      const last = msgs.at(-1);
      return {
        key: `group:${g.id}`,
        kind: "group",
        id: g.id,
        name: g.title,
        subtitle: g.classTag,
        preview: last ? `${last.senderName}: ${last.text}` : "No messages yet",
        unread: 0,
        lastAtSort: msgs.length + 500 - idx,
      };
    });
    return [...dmThreads, ...groupThreads].sort((a, b) => b.lastAtSort - a.lastAtSort);
  }, [conversations, messagesByConversation, allGroups, groupMessagesByGroup]);

  const activeThread = activeKey ? threads.find((t) => t.key === activeKey) : undefined;
  const activeDm = activeThread?.kind === "dm" ? conversations.find((c) => c.id === activeThread.id) : null;
  const activeGroup = activeThread?.kind === "group" ? groupById.get(activeThread.id) : null;
  const dmThread = activeDm ? messagesByConversation[activeDm.id] ?? [] : [];
  const groupThread = activeGroup ? groupMessagesByGroup[activeGroup.id] ?? [] : [];

  function submit() {
    if (!activeThread || !draft.trim()) return;
    const sentText = draft.trim();
    if (activeThread.kind === "dm") {
      sendMessage(activeThread.id, sentText);
      setTypingFor(activeThread.key);
      const cannedReplies = [
        "Yesss I'm down. What time works for you?",
        "Sounds good, I'll be there.",
        "Let's do it — want to start with a quick plan?",
        "Perfect. Can you share your availability?",
      ];
      const nextReply = cannedReplies[sentText.length % cannedReplies.length];
      window.setTimeout(() => {
        receiveMessage(activeThread.id, nextReply);
        setTypingFor((current) => (current === activeThread.key ? null : current));
      }, 1200);
    } else {
      sendGroupMessage(activeThread.id, sentText);
      setTypingFor(activeThread.key);
      const participants = [
        { name: "Jordan Lee", avatar: getStudentById("s1")?.avatarUrl ?? "" },
        { name: "Sam Rivera", avatar: getStudentById("s9")?.avatarUrl ?? "" },
        { name: "Taylor Chen", avatar: getStudentById("s10")?.avatarUrl ?? "" },
      ];
      const next = participants[sentText.length % participants.length];
      const replies = [
        "Love this plan. I can do that time.",
        "I'm in. I'll bring notes.",
        "Can we also review tomorrow's topics?",
      ];
      window.setTimeout(() => {
        receiveGroupMessage(activeThread.id, replies[sentText.length % replies.length], next.name, next.avatar);
        setTypingFor((current) => (current === activeThread.key ? null : current));
      }, 1300);
    }
    setDraft("");
  }

  const dmPrompts = [
    "Wanna grab coffee after class?",
    "Gym + study later tonight?",
    "You down for a library + boba run?",
    "Any campus event plans this week?",
  ];
  const groupPrompts = [
    "I'm free tonight 7-9pm, who else?",
    "Let's vote on meeting time.",
    "Dropping resources in this thread now.",
    "Can someone host this week?",
  ];
  const prompts = activeThread?.kind === "group" ? groupPrompts : dmPrompts;

  React.useEffect(() => {
    if (activeThread?.kind === "dm" && activeThread.id) {
      markConversationRead(activeThread.id);
    }
  }, [activeThread?.kind, activeThread?.id, markConversationRead]);

  const visibleThreads = threads.filter((t) => {
    const match = t.name.toLowerCase().includes(query.toLowerCase()) || t.preview.toLowerCase().includes(query.toLowerCase());
    if (!match) return false;
    if (filter === "dm" && t.kind !== "dm") return false;
    if (filter === "group" && t.kind !== "group") return false;
    return true;
  });

  if (!activeThread) {
    return (
      <Card className="mx-auto flex min-h-[calc(100dvh-8.25rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border bg-white/92 shadow-soft sm:rounded-3xl">
        <div className="space-y-2 border-b px-4 py-3">
          <div className="flex items-center justify-between text-sm font-semibold gap-2">
            <span>Inbox</span>
            <div className="inline-flex rounded-full bg-muted p-0.5 text-xs">
              {(["all", "dm", "group"] as const).map((kind) => (
                <button
                  key={kind}
                  onClick={() => setFilter(kind)}
                  className={cn(
                    "rounded-full px-2.5 py-1 transition-colors",
                    filter === kind ? "bg-white shadow-soft text-foreground" : "text-muted-foreground",
                  )}
                >
                  {kind === "all" ? "All" : kind === "dm" ? "DMs" : "Groups"}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats..."
              className="h-8 rounded-full pl-8 text-xs"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <ul className="space-y-1 p-2">
            {visibleThreads.map((t) => {
              const sel = t.key === activeKey;
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    onClick={() => setActiveKey(t.key)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors sm:rounded-2xl",
                      sel ? "bg-secondary text-foreground" : "hover:bg-muted/70",
                    )}
                  >
                    {t.kind === "dm" ? (
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-white">
                        <Image src={t.avatar || ""} alt={t.name} fill className="object-cover" sizes="44px" />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Hash className="h-4 w-4" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-medium">{t.name}</span>
                        {t.unread ? (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                            {t.unread}
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">{t.subtitle}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.preview}</p>
                    </div>
                  </button>
                </li>
              );
            })}
            {!visibleThreads.length ? (
              <li className="px-2 py-6 text-center text-xs text-muted-foreground">No chats match this filter.</li>
            ) : null}
          </ul>
        </ScrollArea>
      </Card>
    );
  }

  return (
    <Card className="mx-auto flex min-h-[calc(100dvh-8.25rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-white/94 shadow-soft sm:rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => {
              setActiveKey(null);
              setDraft("");
              setTypingFor(null);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {activeThread.kind === "dm" ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
              <Image src={activeThread.avatar || ""} alt={activeThread.name} fill className="object-cover" sizes="40px" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Hash className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold">{activeThread.name}</p>
            <p className="text-xs text-muted-foreground">
              {activeThread.kind === "dm" ? "Direct message" : `${activeGroup?.classTag ?? "Group"} · ${activeGroup?.memberCount ?? 0} members`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {(activeThread.kind === "dm" ? dmThread : groupThread).length ? (
            (activeThread.kind === "dm" ? dmThread : groupThread).map((m) => (
              <div key={m.id} className={cn("flex", m.fromMe ? "justify-end" : "justify-start")}>
                {!m.fromMe ? (
                  <div className="mr-2 mt-auto relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={
                        activeThread.kind === "dm"
                          ? activeThread.avatar || ""
                          : "senderAvatar" in m
                            ? m.senderAvatar || (getStudentById("s1")?.avatarUrl ?? "")
                            : getStudentById("s1")?.avatarUrl ?? ""
                      }
                      alt={activeThread.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                ) : null}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-soft",
                    m.fromMe
                      ? "rounded-br-md bg-primary text-primary-foreground"
                      : "rounded-bl-md border bg-white",
                  )}
                >
                  {activeThread.kind === "group" && !m.fromMe && "senderName" in m ? (
                    <p className="mb-0.5 text-[11px] font-medium opacity-80">{m.senderName}</p>
                  ) : null}
                  {m.text}
                  <p className={cn("mt-1 text-[10px] opacity-75", m.fromMe && "text-primary-foreground/80")}>{m.at}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No messages yet. Send the first text.</p>
          )}
          {typingFor === activeThread.key ? (
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              <div className="relative h-6 w-6 overflow-hidden rounded-full">
                <Image
                  src={activeThread.kind === "dm" ? activeThread.avatar || "" : getStudentById("s1")?.avatarUrl ?? ""}
                  alt={activeThread.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              </div>
              <span>{activeThread.kind === "dm" ? activeThread.name : "Someone"} is typing...</span>
            </div>
          ) : null}
        </div>
      </ScrollArea>

      <div className="safe-pb space-y-2 border-t bg-card p-3">
        <div className="flex flex-wrap gap-2">
          {prompts.map((p) => (
            <Button
              key={p}
              type="button"
              variant="outline"
              size="sm"
              className="h-auto rounded-full whitespace-normal py-1.5 text-left text-xs font-normal"
              onClick={() => setDraft(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Button type="button" variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setDraft((d) => `${d}${d ? " " : ""}😊`)}>
            <Smile className="h-4 w-4" />
          </Button>
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={activeThread.kind === "dm" ? "Message..." : "Message group..."}
            className="flex-1 rounded-full bg-white"
          />
          <Button type="submit" disabled={!draft.trim()} className="rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
