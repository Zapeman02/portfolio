import type { ProjectContext } from '../data/projects'

export function ContextBadge({ context }: { context: ProjectContext }) {
  return <span className={`context-badge${context === 'Real use' ? ' is-real' : ''}`}>{context}</span>
}
