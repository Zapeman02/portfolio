import { profile } from '../data/profile'
import { SocialLinks } from './SocialLinks'

export function Hero() {
  return (
    <header className="hero">
      <p className="hero-name">{profile.name}</p>
      <h1 className="hero-headline">{profile.headline}</h1>
      <p className="hero-tagline">{profile.tagline}</p>
      <p className="hero-intro">{profile.intro}</p>
      <SocialLinks />
    </header>
  )
}
