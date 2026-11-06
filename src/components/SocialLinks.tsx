import { profile } from '../data/profile'
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons'

export function SocialLinks() {
  const { github, linkedin, email } = profile.links
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
      <li>
        <a href={email}>
          <MailIcon /> Email
        </a>
      </li>
    </ul>
  )
}
