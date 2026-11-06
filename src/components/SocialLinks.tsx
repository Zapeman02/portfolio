import { profile } from '../data/profile'
import { GitHubIcon, LinkedInIcon } from './Icons'

export function SocialLinks() {
  const { github, linkedin } = profile.links
  return (
    <ul className="social">
      <li>
        <a href={github} target="_blank" rel="noreferrer">
          <GitHubIcon /> GitHub
        </a>
      </li>
      <li>
        <a href={linkedin} target="_blank" rel="noreferrer">
          <LinkedInIcon /> LinkedIn
        </a>
      </li>
    </ul>
  )
}
