import DashboardLayout from "@/components/layout/DashboardLayout";
import { AppPreloader } from "@/components/landing/AppPreloader";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppPreloader />
      <DashboardLayout>{children}</DashboardLayout>
    </>
  );
}

