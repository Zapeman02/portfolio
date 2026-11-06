import { useEffect, useRef } from 'react'
import { PRIVATE_LABEL, type Project } from '../data/projects'
import { TagList } from './TagList'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [onClose])

  const titleId = `${project.id}-detail-title`

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <div
        className="detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="detail-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id={titleId} className="detail-title">
          {project.title}
        </h2>
        <TagList tags={project.tags} label={`${project.title} tags`} />

        {project.images.length > 0 && (
          <div className="detail-images">
            {project.images.map((image) => (
              <img key={image.src} src={image.src} alt={image.alt} loading="lazy" />
            ))}
          </div>
        )}

        <h3>The problem</h3>
        <p>{project.problem}</p>
        <h3>What I built</h3>
        <p>{project.solution}</p>
        <h3>How</h3>
        <ul className="detail-how">
          {project.how.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="detail-links">
          {project.links.length === 0 ? (
            <span className="tag">{project.privateLabel ?? PRIVATE_LABEL}</span>
          ) : (
            project.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label} ↗
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
