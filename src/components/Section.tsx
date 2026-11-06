import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface SectionProps {
  id: string
  title: string
  children: ReactNode
}

export function Section({ id, title, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <section
      ref={ref}
      id={id}
      className={`section reveal${inView ? ' is-visible' : ''}`}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="section-title">
        {title}
      </h2>
      {children}
    </section>
  )
}
