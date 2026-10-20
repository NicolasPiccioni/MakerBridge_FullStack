import { Outlet } from 'react-router-dom'
import MakerHeader from './MakerHeader'
import MakerSubHeader from './MakerSubHeader'
import MakerFooter from './MakerFooter'

export default function MakerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf7f0] text-[#292524] antialiased">
      <MakerHeader />
      <MakerSubHeader />
      <main className="w-full flex-1 max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        <Outlet />
      </main>
      <MakerFooter />
    </div>
  )
}
