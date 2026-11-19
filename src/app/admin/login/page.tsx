import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import { AdminLogin } from "@/components/admin/login";
export const dynamic = "force-dynamic";
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <AdminLogin />;
}
