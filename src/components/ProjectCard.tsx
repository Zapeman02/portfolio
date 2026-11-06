import type { PointerEvent } from 'react'
import type { Project } from '../data/projects'
import { TagList } from './TagList'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const cover = project.images[0]
  return (
    <article className="card project-card" onPointerMove={trackPointer}>
      {cover && (
        <div className="project-cover">
          <img src={cover.src} alt="" loading="lazy" />
        </div>
      )}
      <h3>
        <button type="button" className="project-open" onClick={() => onOpen(project)}>
          {project.title}
        </button>
      </h3>
      <p className="project-problem">{project.problem}</p>
      <TagList tags={project.tags} label={`${project.title} tags`} />
    </article>
  )
}

function trackPointer(e: PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - rect.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - rect.top}px`)
}
