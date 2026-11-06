import { builtWith, interests } from '../data/interests'
import { Section } from './Section'
import { TagList } from './TagList'

export function Interests() {
  return (
    <Section id="interests" title="Interests & tech">
      <h3 className="subheading">Interests</h3>
      <TagList tags={interests} label="Interests" />
      <h3 className="subheading">Tech I've built with</h3>
      <TagList tags={builtWith} label="Tech I've built with" />
    </Section>
  )
}
