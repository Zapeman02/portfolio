import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowIWork } from './components/HowIWork'
import { Interests } from './components/Interests'

export default function App() {
  return (
    <>
      <div className="glow" aria-hidden="true" />
      <main className="container">
        <Hero />
        <HowIWork />
        <Experience />
        <Interests />
      </main>
      <Footer />
    </>
  )
}
