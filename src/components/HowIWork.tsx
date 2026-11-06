import { workflowExample, workflowSteps } from '../data/workflow'
import { Section } from './Section'

export function HowIWork() {
  return (
    <Section id="how-i-work" title="How I work">
      <p className="section-lead">Fast doesn't mean sloppy.</p>
      <ol className="steps">
        {workflowSteps.map((step, i) => (
          <li key={step.title} className="card step">
            <span className="step-number">0{i + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
      <p className="example">{workflowExample}</p>
    </Section>
  )
}
