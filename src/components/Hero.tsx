import { profile } from '../data/profile'
import { Contributions } from './Contributions'
import { SocialLinks } from './SocialLinks'

export function Hero() {
  return (
    <header className="hero">
      <div className="hero-text">
        <p className="hero-name">{profile.name}</p>
        <h1 className="hero-headline">{profile.headline}</h1>
        <p className="hero-tagline">{profile.tagline}</p>
        <p className="hero-intro">{profile.intro}</p>
        <SocialLinks />
      </div>
      <Contributions />
    </header>
  )
}
