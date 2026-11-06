import { experience } from '../data/experience'
import { Section } from './Section'

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="timeline">
        {experience.map((item) => (
          <li key={`${item.role}-${item.place}`} className="timeline-item">
            <p className="timeline-period">{item.period}</p>
            <h3>
              {item.role} <span className="timeline-place">· {item.place}</span>
            </h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
