import { lazy, Suspense, useState } from 'react'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HowIWork } from './components/HowIWork'
import { Interests } from './components/Interests'
import { NetworkBackground } from './components/NetworkBackground'
import { Projects } from './components/Projects'
import { projects } from './data/projects'

const DeskScene = lazy(() => import('./desk/DeskScene'))

export default function App() {
  const [deskView, setDeskView] = useState(false)

  return (
    <>
      <div className="view-switch" role="group" aria-label="Page view">
        <button type="button" aria-pressed={!deskView} onClick={() => setDeskView(false)}>
          Standard
        </button>
        <button type="button" aria-pressed={deskView} onClick={() => setDeskView(true)}>
          Desk
        </button>
      </div>
      {deskView ? (
        <Suspense fallback={<p className="desk-loading">Loading the desk…</p>}>
          <DeskScene projects={projects} />
        </Suspense>
      ) : (
        <>
          <div className="glow" aria-hidden="true" />
          <div className="glow glow-2" aria-hidden="true" />
          <NetworkBackground />
          <main className="container">
            <Hero />
            <Projects />
            <Experience />
            <Interests />
            <HowIWork />
          </main>
          <Footer />
        </>
      )}
    </>
  )
}
