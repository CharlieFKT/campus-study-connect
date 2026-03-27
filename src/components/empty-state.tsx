import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <Card className="border-dashed bg-muted/20 shadow-none">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center sm:py-16">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-soft">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </span>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
