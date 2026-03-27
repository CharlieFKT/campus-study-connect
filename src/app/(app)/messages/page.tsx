import { Suspense } from "react";
import { MessagesClient } from "./messages-client";

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
        <p className="mt-1 text-muted-foreground">
          One Instagram-style inbox for direct messages + group chats, with search, filters, and live thread flow.
        </p>
      </div>
      <Suspense fallback={<div className="animate-pulse text-sm text-muted-foreground">Loading chats…</div>}>
        <MessagesClient />
      </Suspense>
    </div>
  );
}
