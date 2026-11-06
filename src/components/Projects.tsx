import { useCallback, useState } from 'react'
import { projects, type Project } from '../data/projects'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ProjectCard } from './ProjectCard'
import { ProjectDetail } from './ProjectDetail'
import { Section } from './Section'

const ALL = 'All'
const categories: Record<string, string[]> = {
  Apps: ['iOS', 'macOS', 'Android'],
  IoT: ['IoT', 'Embedded', 'BLE', 'CAN', 'MQTT', 'Robotics', 'Smart home'],
  AI: ['AI', 'RL'],
  Web: ['Web', 'React', 'TypeScript'],
  Games: ['Game'],
}
const filters = [ALL, ...Object.keys(categories)]
const MOBILE_FEATURED = 3

const inCategory = (project: Project, category: string) =>
  project.tags.some((tag) => categories[category].includes(tag))

export function Projects() {
  const [activeCategory, setActiveCategory] = useState(ALL)
  const [selected, setSelected] = useState<Project | null>(null)
  const [showAll, setShowAll] = useState(false)
  const close = useCallback(() => setSelected(null), [])
  const isMobile = useMediaQuery('(max-width: 719px)')

  const filtered = activeCategory === ALL ? projects : projects.filter((p) => inCategory(p, activeCategory))
  const canCollapse = activeCategory === ALL
  const featured = filtered.filter((p) => p.featured).slice(0, isMobile ? MOBILE_FEATURED : undefined)
  const visible = canCollapse && !showAll ? featured : filtered
  const hiddenCount = filtered.length - featured.length

  return (
    <Section id="projects" title="Projects">
      <p className="section-lead">Everyday problems I solved, and how I built the fix.</p>
      <div className="filter" role="group" aria-label="Filter projects by category">
        {filters.map((category) => (
          <button
            key={category}
            type="button"
            className="filter-button"
            aria-pressed={category === activeCategory}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <ul className="project-grid">
        {visible.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} onOpen={setSelected} />
          </li>
        ))}
      </ul>
      {canCollapse && hiddenCount > 0 && (
        <button type="button" className="show-more" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show fewer projects' : `Show ${hiddenCount} more project${hiddenCount === 1 ? '' : 's'}`}
        </button>
      )}
      {selected && <ProjectDetail project={selected} onClose={close} />}
    </Section>
  )
}
