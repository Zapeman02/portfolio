import { profile } from '../data/profile'
import { SocialLinks } from './SocialLinks'

export function Footer() {
  return (
    <footer className="footer">
      <h2 className="footer-title">Have an idea? Let's build it.</h2>
      <SocialLinks />
      <p className="footer-note">© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  )
}
