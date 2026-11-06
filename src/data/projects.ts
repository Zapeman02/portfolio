import carspotterCollection from '../assets/projects/carspotter-collection.webp'
import carspotterFeed from '../assets/projects/carspotter-feed.webp'
import carspotterHome from '../assets/projects/carspotter-home.webp'
import rocketbike from '../assets/projects/rocketbike.webp'
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
  privateLabel?: string
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
  {
    id: 'rocketbike',
    title: 'RocketBike: live app for an electric motorbike',
    problem:
      'An electric pocket bike at Knowit was fitted with electronics that read its data from the CAN bus and sent it to the cloud. That data was only useful if the rider could actually see it.',
    solution:
      'An iOS app that shows the bike live: locked or unlocked, speed, battery, GPS position on a map and graphs of recent rides.',
    how: [
      'My internship at Knowit, in a team of 7: UI/UX, app developers, one cloud developer and two embedded developers.',
      'I built the iOS app. The cloud developer built the AWS backend the app connects to.',
      'Data goes from the CAN bus to the cloud to the app, so we learned how a vehicle talks internally by reading real CAN frames.',
      'Worked properly in Git as a team, with branches, PRs and reviews.',
    ],
    tags: ['iOS', 'Swift', 'IoT', 'CAN', 'AWS'],
    images: [{ src: rocketbike, alt: 'The RocketBike electric pocket bike with its electronics exposed' }],
    links: [],
    privateLabel: 'Private / Knowit internship',
  },
  {
    id: 'carspotter',
    title: 'CarSpotter: collect cars like trading cards',
    problem:
      'Looking up a car you spot on the street is slow and boring: you have to type the plate into a website by hand.',
    solution:
      'An Android app where you snap a photo of a car. Text recognition (OCR) reads the plate, and the app shows model, year, horsepower and a rarity level. Every car goes into your collection, with a feed, followers and a leaderboard.',
    how: [
      'Team of 3 in the Android course. I did the UI, the data types, the loading states and parts of the ViewModel.',
      'Kotlin with Jetpack Compose and MVVM: a ViewModel feeds the screens from a Room database and a car API.',
      'Also reads QR codes and supports multiple languages and runtime permissions.',
    ],
    tags: ['Android', 'Kotlin', 'Compose', 'OCR'],
    images: [
      { src: carspotterCollection, alt: 'Collection screen with spotted cars as cards in different rarity levels' },
      { src: carspotterHome, alt: 'Home screen with profile, top spot, recent spots and leaderboard' },
      { src: carspotterFeed, alt: 'Feed with cars other users have spotted' },
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/Zapeman02/carSpotter-Android' }],
  },
]
