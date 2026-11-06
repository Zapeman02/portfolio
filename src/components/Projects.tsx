import { useCallback, useState } from 'react'
import { projects, type Project } from '../data/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectDetail } from './ProjectDetail'
import { Section } from './Section'

const ALL = 'All'
const allTags = [ALL, ...new Set(projects.flatMap((p) => p.tags))]

export function Projects() {
  const [activeTag, setActiveTag] = useState(ALL)
  const [selected, setSelected] = useState<Project | null>(null)
  const close = useCallback(() => setSelected(null), [])

  const visible = activeTag === ALL ? projects : projects.filter((p) => p.tags.includes(activeTag))

  return (
    <Section id="projects" title="Projects">
      <p className="section-lead">Everyday problems I solved, and how I built the fix.</p>
      <div className="filter" role="group" aria-label="Filter projects by tag">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="filter-button"
            aria-pressed={tag === activeTag}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
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
      {selected && <ProjectDetail project={selected} onClose={close} />}
    </Section>
  )
}
