import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { AdminSettings } from "@/components/admin/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminSettings email={session.email} />;
}
