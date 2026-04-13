import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — görünür: md ve üstü */}
      <Sidebar />

      {/* Ana içerik */}
      <div className="flex flex-col flex-1 min-h-screen md:min-h-0">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* BottomNav — görünür: md altı */}
        <BottomNav />
      </div>
    </div>
  )
}
