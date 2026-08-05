import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_token");

  if (!isAdmin) {
    redirect("/become-admin");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
