export interface ExperienceItem {
  place: string
  role: string
  period: string
  text: string
  upcoming?: boolean
}

export const experience: ExperienceItem[] = [
  {
    place: 'Husqvarna',
    role: 'Thesis project',
    period: 'Spring 2027',
    text: 'Thesis project that grew out of our SEPM robot demo.',
    upcoming: true,
  },
  {
    place: 'Knowit',
    role: 'RocketBike project',
    period: 'Mar 2026 – Jul 2026',
    text: 'Built the RocketBike iOS app with an AWS backend.',
  },
  {
    place: 'JTH',
    role: 'Lab assistant',
    period: 'Sep 2025 – Aug 2026',
    text: 'Guided students in C/C++, Data Structures & Algorithms, hardware and debugging.',
  },
  {
    place: 'JTH, Jönköping University',
    role: 'BSc Computer Engineering',
    period: 'Aug 2024 – Jul 2027',
    text: 'Software Development and Mobile Platforms.',
  },
  {
    place: 'BHV Verktyg AB',
    role: 'Design engineer',
    period: 'Jun 2021 – present',
    text: 'Design plastic components and injection molding tools in CAD, working closely with customers.',
  },
]
