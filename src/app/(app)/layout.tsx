import { AppShell } from "@/components/layout/app-header";

export default function AppSectionLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
