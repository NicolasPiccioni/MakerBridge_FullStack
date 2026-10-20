import { Outlet } from 'react-router'
import Footer from './Footer'
// import Header from './Header'
import Navbar  from './Navbar'

export default function ClienteLayout() {
  return (
    <div className="min-h-screen bg-brand-crema text-brand-dark flex flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* <Header /> */}
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
