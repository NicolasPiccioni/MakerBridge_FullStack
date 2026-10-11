import Header from '../components/Header'
import FeaturedMaker from '../components/FeaturedMaker'
import Roles from '../components/Roles'
import FeaturedWorks from '../components/FeaturedWorks'
import HowItWorks from '../components/HowItWorks'
import About from '../components/About'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen text-slate-800 antialiased flex flex-col justify-between selection:bg-[#e06d53]/20 selection:text-[#e06d53]">
      <Header />
      <main className="flex-grow">
        <FeaturedMaker />
        <Roles />
        <FeaturedWorks />
        <HowItWorks />
        <About />
      </main>
      <Footer />
    </div>
  )
}
