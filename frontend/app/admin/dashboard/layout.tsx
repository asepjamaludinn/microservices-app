import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-800">
      {/* Sidebar akan selalu ada di semua sub-halaman dashboard */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header akan selalu ada di atas */}
        <Header />

        {/* {children} adalah tempat di mana konten halaman (page.tsx) akan disuntikkan */}
        <div className="p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
