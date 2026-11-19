import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { AdminDashboard } from "@/components/admin/dashboard";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminDashboard email={session.email} />;
}
