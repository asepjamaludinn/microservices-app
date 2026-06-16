import AdminSidebar from "@/components/layouts/admin/AdminSidebar";
import AdminHeader from "@/components/layouts/admin/AdminHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <AdminHeader />
        <div className="p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
