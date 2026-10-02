import Sidebar from '@/components/admin/Sidebar'
import MobileSidebar from '@/components/admin/MobileSidebar'

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBFBF9] selection:bg-[#1e5d3f]/20 selection:text-[#0F1F18] relative"
    >
      {/* ===== Background Texture ===== */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 35%, #1e5d3f 1px, transparent 1px),
                            radial-gradient(circle at 75% 65%, #2a7d57 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ===== Background Blurs ===== */}
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#1e5d3f]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* ===== Mobile Top Bar + Drawer ===== */}
      <MobileSidebar />

      {/* ===== Layout ===== */}
      <div className="flex relative z-10">
        {/* Sidebar (Desktop only) */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0 w-full lg:w-auto px-4 sm:px-6 lg:px-8 pt-[84px] lg:pt-6 pb-6 lg:pb-8">
  {children}
</main>
      </div>
    </div>
  )
}