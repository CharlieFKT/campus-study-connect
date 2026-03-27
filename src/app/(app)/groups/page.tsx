import { Suspense } from "react";
import { GroupsClient } from "./groups-client";

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse text-sm text-muted-foreground">Loading groups…</div>}>
      <GroupsClient />
    </Suspense>
  );
}
