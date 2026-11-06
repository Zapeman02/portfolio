import sepmMap from '../assets/projects/sepm-map.webp'
import sepmStatus from '../assets/projects/sepm-status.webp'

export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  id: string
  title: string
  problem: string
  solution: string
  how: string[]
  tags: string[]
  images: ProjectImage[]
  links: ProjectLink[]
}

export const PRIVATE_LABEL = 'Private / school project'

export const projects: Project[] = [
  {
    id: 'sepm-robot',
    title: 'Self-driving robot with an iOS app',
    problem:
      'The course asked each team to turn a Husqvarna robot lawnmower into a robot that drives itself, avoids obstacles and sends a photo when it hits something, with a phone app to drive it and see its path, and a backend that stores it all. How we worked was graded as much as what we built.',
    solution:
      'We were the only team to go with reinforcement learning. The driving policy was trained in a simulator and runs on the robot’s Raspberry Pi, with a rule-based safety shield that always has the last word. Beyond the requirements we added a map that remembers every wall it has seen, tap-to-go on the map and AI classification of the collision photos.',
    how: [
      'Team of 7, three Scrum sprints with rotating roles. I mostly built the iOS app and its BLE protocol, and was Scrum Master in the final sprint.',
      'Contracts first: the BLE packet format and map format were written down before any code, so robot, app and backend could be built in parallel.',
      '670+ commits and 150+ merged PRs, each with CI for its part and a human approving every merge.',
      'Tests on three levels: unit, integration and acceptance tests on the real robot, recorded as gifs. A traceability matrix links every requirement to its code and test.',
      'AI agents used on purpose, with written rules and roles: architect, engineer, QA, security and reviewer.',
      'Picked to present the project at a high school. I gave the final demo to all classes and Husqvarna, which led to my thesis project with them.',
    ],
    tags: ['iOS', 'Swift', 'BLE', 'Robotics', 'RL', 'Scrum', 'CI'],
    images: [
      { src: sepmMap, alt: 'The app’s live map with walls, the robot’s path and collision dots' },
      { src: sepmStatus, alt: 'The app’s status screen, connected to the robot over BLE' },
    ],
    links: [],
  },
]
