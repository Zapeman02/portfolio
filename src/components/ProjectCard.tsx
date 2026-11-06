import type { Project } from '../data/projects'
import { TagList } from './TagList'

interface ProjectCardProps {
  project: Project
  onOpen: (project: Project) => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const cover = project.images[0]
  return (
    <article className="card project-card">
      {cover && <img className="project-cover" src={cover.src} alt="" loading="lazy" />}
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
