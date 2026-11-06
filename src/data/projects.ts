import agbBatch from '../assets/projects/agb-batch.webp'
import agbDevice from '../assets/projects/agb-device.webp'
import agbOverview from '../assets/projects/agb-overview.webp'
import arcraidersFocus from '../assets/projects/arcraiders-focus.webp'
import arcraidersLoot from '../assets/projects/arcraiders-loot.webp'
import arcraidersSkills from '../assets/projects/arcraiders-skills.webp'
import arcraidersWeapons from '../assets/projects/arcraiders-weapons.webp'
import arcraidersWorkshop from '../assets/projects/arcraiders-workshop.webp'
import bletrackerClose from '../assets/projects/bletracker-close.webp'
import bletrackerFar from '../assets/projects/bletracker-far.webp'
import bletrackerList from '../assets/projects/bletracker-list.webp'
import bletrackerMedium from '../assets/projects/bletracker-medium.webp'
import calmweekPopover from '../assets/projects/calmweek-popover.webp'
import calmweekWeek from '../assets/projects/calmweek-week.webp'
import carspotterCollection from '../assets/projects/carspotter-collection.webp'
import carspotterFeed from '../assets/projects/carspotter-feed.webp'
import carspotterHome from '../assets/projects/carspotter-home.webp'
import eventhorizonGlow from '../assets/projects/eventhorizon-glow.webp'
import eventhorizonShelf from '../assets/projects/eventhorizon-shelf.webp'
import fourinrowDifficulty from '../assets/projects/fourinrow-difficulty.webp'
import fourinrowGame from '../assets/projects/fourinrow-game.webp'
import icaDesktop from '../assets/projects/ica-desktop.webp'
import icaMobile from '../assets/projects/ica-mobile.webp'
import racedayDashboard from '../assets/projects/raceday-dashboard.webp'
import racedayDrivers from '../assets/projects/raceday-drivers.webp'
import racedayMap from '../assets/projects/raceday-map.webp'
import racedayRace from '../assets/projects/raceday-race.webp'
import racerlearningGarage from '../assets/projects/racerlearning-garage.webp'
import racerlearningRace from '../assets/projects/racerlearning-race.webp'
import racerlearningTrain from '../assets/projects/racerlearning-train.webp'
import rocketbike from '../assets/projects/rocketbike.webp'
import sensornodeMatrix from '../assets/projects/sensornode-matrix.webp'
import sepmAutonomous from '../assets/projects/sepm-autonomous.webp'
import sepmControl from '../assets/projects/sepm-control.webp'
import sepmLogs from '../assets/projects/sepm-logs.webp'
import sepmStatus from '../assets/projects/sepm-status.webp'
import smarthome from '../assets/projects/smarthome.webp'

export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectLink {
  label: string
  url: string
}

export type ProjectContext = 'Real use' | 'Internship' | 'School' | 'Personal'

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
  featured?: boolean
  context: ProjectContext
  inProgress?: boolean
}

export const PRIVATE_LABEL = 'Private / school project'

export const projects: Project[] = [
  {
    id: 'sepm-robot',
    context: 'School',
    featured: true,
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
      'When high school students visited, our team was picked to present the project to them. I gave the final demo to all classes and Husqvarna, which led to my thesis project with them.',
    ],
    tags: ['iOS', 'Swift', 'BLE', 'Robotics', 'RL', 'Scrum', 'CI'],
    images: [
      { src: sepmAutonomous, alt: 'Live map in autonomous mode with walls, the robot’s path and collision dots' },
      { src: sepmControl, alt: 'Control screen with speed and steer sticks for manual driving' },
      { src: sepmStatus, alt: 'Status screen, connected to the robot over BLE' },
      { src: sepmLogs, alt: 'In-app log of connection, control and session events' },
    ],
    links: [],
  },
  {
    id: 'agb',
    context: 'Real use',
    featured: true,
    title: 'AGB: automatic grain drying for a real farm',
    problem:
      'After harvest, grain must be dried to a safe moisture level in the bin or it spoils. On my friend’s farm the moisture was measured only twice, when the grain went in and when it was sold. Everything in between, including when to run the drying fan, was guesswork.',
    solution:
      'Sensors in the bin measure temperature, humidity and air pressure and send them over MQTT to the cloud. The system estimates the grain’s moisture and weight and recommends when the fan should run. A web dashboard shows every bin, its drying batches and history, and lets you control the fan from anywhere.',
    how: [
      'Built by me and a friend over a whole summer, and used on the farm’s real harvest.',
      'Raspberry Pi Pico and ESP32-C3 microcontrollers, an MQTT bridge in Node.js/TypeScript, Supabase (Postgres, auth and realtime) and a React dashboard on Vercel.',
      'Commands go both ways: the dashboard writes the desired fan state and the bridge pushes it to the hardware.',
      'Row-level security, so every user only sees their own bins.',
      'I wrote most of the code (286 of 324 commits).',
    ],
    tags: ['IoT', 'Hardware', 'MQTT', 'Supabase', 'React', 'TypeScript'],
    images: [
      { src: agbDevice, alt: 'Device view with fan status, moisture estimate, current batch and batch history' },
      { src: agbOverview, alt: 'Overview of all grain bins with grain type, weight and fan status' },
      { src: agbBatch, alt: 'A finished drying batch with grain loadings and end moisture' },
    ],
    links: [],
    privateLabel: 'Private / farm project',
  },
  {
    id: 'racerlearning',
    context: 'Personal',
    featured: true,
    title: 'Racerlearning: train your own AI racer',
    problem:
      'One evening I wanted to play a game where you don’t drive yourself, but train an AI racer by deciding what it gets rewarded for. It didn’t exist anywhere except in my head.',
    solution:
      'A neon Tokyo street racing game in the browser. Drag reward sliders for progress, speed, crashes and drifting, watch 40 cars evolve through neuroevolution, then race your model against the built-in base model KAMI-01 on generated tracks.',
    how: [
      'Each car sees the road through 7 distance rays plus its speed, slide and the next bend. A tiny neural network (11 → 16 → 2) turns that into steering and throttle.',
      'Written from scratch in TypeScript with Canvas 2D and Vite. No game engine and no ML library.',
      'Racers can be shared with a code that holds the whole model, so no server is needed.',
      'CI runs typecheck, unit tests and Playwright UI tests in Chromium and WebKit, and every merge to main deploys automatically to itch.io.',
    ],
    tags: ['Game', 'AI', 'TypeScript', 'CI'],
    images: [
      { src: racerlearningGarage, alt: 'Garage screen with the base model KAMI-01 and a neon city track' },
      { src: racerlearningTrain, alt: 'Training view with reward sliders and 40 cars evolving' },
      { src: racerlearningRace, alt: 'A race on a generated track through a neon city' },
    ],
    links: [
      { label: 'Play on itch.io', url: 'https://zapeman02.itch.io/racerlearning' },
      { label: 'GitHub', url: 'https://github.com/Zapeman02/Racerlearning' },
    ],
  },
  {
    id: 'eventhorizon',
    context: 'Personal',
    featured: true,
    title: 'EventHorizon: a file shelf in the MacBook notch',
    problem:
      'When you move files between apps you often need somewhere to park them for a moment. The desktop fills up, and the notch on a MacBook is just dead space.',
    solution:
      'A tiny macOS app that turns the notch into a shelf. Drag a file to the notch, watch it fall into a glowing black hole and drag it back out whenever you need it. Files dropped together stay together.',
    how: [
      'Native Swift and SwiftUI, with no Dock or menu bar icon. It starts at login and stays out of the way.',
      'The notch starts glowing when you pick up a file and burns brighter the closer you get.',
      'Only references are stored, so nothing is copied and the shelf stays tiny.',
      'Released on GitHub with a ready-to-run download, and people outside my circle have downloaded it.',
      'Builds with one script using only Apple’s Command Line Tools, no full Xcode needed.',
    ],
    tags: ['macOS', 'Swift', 'SwiftUI'],
    images: [
      { src: eventhorizonGlow, alt: 'A file being dragged into the glowing black hole in the MacBook notch' },
      { src: eventhorizonShelf, alt: 'The open notch shelf with a single file and a stack of five files' },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/Zapeman02/EventHorizon' },
      { label: 'Download', url: 'https://github.com/Zapeman02/EventHorizon/releases/latest' },
    ],
  },
  {
    id: 'rocketbike',
    context: 'Internship',
    featured: true,
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
    id: 'raceday',
    context: 'School',
    featured: true,
    title: 'RaceDay: a live F1 dashboard for your phone',
    problem:
      'When you watch a Formula 1 race on TV you only see what the broadcast shows. We wanted a second screen with a live map of every car and the numbers behind the race, to follow along while watching.',
    solution:
      'An iOS app built on the OpenF1 API. It shows every car moving on a map of the track, the standings and intervals, and a dashboard for your favorite drivers. Past races can be replayed too.',
    how: [
      'Team of 3 in the iOS course. I set up the app structure and tab navigation and wrote most of the views.',
      'SwiftUI with @Observable state, async/await against the OpenF1 REST API, and SwiftData to remember the last race you picked.',
      'A race produces huge amounts of telemetry. To read the right sample in real time without lag, we look it up by timestamp with binary search instead of scanning the whole list.',
    ],
    tags: ['iOS', 'Swift', 'SwiftUI'],
    images: [
      { src: racedayDashboard, alt: 'Live dashboard with speed, gear, DRS and rev lights for favorite drivers' },
      { src: racedayMap, alt: 'Live track map with every car as a colored dot' },
      { src: racedayDrivers, alt: 'Driver list with team and favorite stars' },
      { src: racedayRace, alt: 'Race picker with track, year and start and reset buttons' },
    ],
    links: [],
  },
  {
    id: 'calm-week',
    context: 'Personal',
    title: 'Calm Week: a week planner that plans itself',
    problem:
      'Juggling school, training, society work and free time made my weeks stressful. A normal calendar only shows what is booked, it doesn’t help you fit everything in.',
    solution:
      'A calm desktop week planner. Fixed things like exams stay put, weekly goals like training and study are placed automatically around them, and free time is protected. The week shows up in TimeTree by itself.',
    how: [
      'No runtime dependencies: a vanilla JS front end with my own drag-and-drop week grid, and a Python standard-library server.',
      'Imports the school schedule from TimeEdit. TimeTree has no API, so the week is published as an .ics feed through a secret GitHub Gist that TimeTree subscribes to.',
      'A rule-based scheduler spreads sessions over the week, and an Ask Claude button can suggest times within the same rules.',
      'Playwright end-to-end tests in Chromium and WebKit.',
    ],
    tags: ['Web', 'Python', 'AI', 'Productivity'],
    images: [
      { src: calmweekWeek, alt: 'A planned week with study, hardware, training and free time blocks' },
      { src: calmweekPopover, alt: 'Editing a block in the week planner' },
    ],
    links: [],
    privateLabel: 'Private / personal tool',
  },
  {
    id: 'smart-home',
    context: 'Personal',
    title: 'A smart home that sets the right light by itself',
    problem:
      'I wanted the right lighting on at home at all times, without clicking through a bunch of light switches and apps.',
    solution:
      'Home Assistant on a Raspberry Pi that runs the home by itself: lights follow the time of day, wake-up lighting brightens slowly in the morning and the TV backlight syncs with the screen. Just for fun, the lights also blink when someone gifts subs on Twitch.',
    how: [
      'The whole config lives in Git: protected main, every change through a PR, and a small add-on I wrote pulls main onto the Pi and reloads Home Assistant without a restart.',
      'Custom Python scripts for the lighting (circadian rhythm, color wave, ambient sync), shared in a public repo with ready-made automations.',
      'An add-on of my own that listens to Twitch events.',
      'Secrets and keys stay on the Pi, never in Git.',
    ],
    tags: ['IoT', 'Smart home', 'Python', 'Home Assistant'],
    images: [{ src: smarthome, alt: 'Home Assistant logo' }],
    links: [{ label: 'Python scripts on GitHub', url: 'https://github.com/Zapeman02/home_assistant_python_scripts' }],
  },
  {
    id: 'carspotter',
    context: 'School',
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
  {
    id: 'ica-list',
    context: 'Personal',
    title: 'A shopping list that syncs itself',
    problem:
      'I write groceries in Apple Reminders but shop with the ICA app. Moving the list over by hand every time was boring, and ICA often didn’t recognise what I had typed.',
    solution:
      'A small app that keeps Apple Reminders and my ICA shopping list in sync both ways, and lets Claude clean up names and merge duplicates so ICA recognises the items.',
    how: [
      'Python backend that talks to Apple Reminders through EventKit and to ICA through its unofficial API, with an autosync in the background.',
      'MCP servers so Claude can move groceries and whole recipes between Reminders and ICA straight from a chat.',
      'Unit tests plus end-to-end tests with screenshots on desktop and mobile.',
    ],
    tags: ['Python', 'AI', 'Automation'],
    images: [
      { src: icaDesktop, alt: 'Sync view showing what moves between Reminders and the ICA list' },
      { src: icaMobile, alt: 'The shopping list app on a phone' },
    ],
    links: [],
    privateLabel: 'Private / personal tool',
  },
  {
    id: 'kundboken',
    context: 'Real use',
    title: 'KundBoken: a customer book for a salon',
    problem:
      'A salon needed one simple place for its customers, their visits and private notes, and those notes had to stay private.',
    solution:
      'A web app where each salon account sees only its own customers, with visit history and optional sensitive notes.',
    how: [
      'React and TypeScript on Firebase Auth and Firestore. Security rules only let a user read and write their own data.',
      'Sensitive notes are encrypted in the browser with AES-GCM before they are saved. The key is wrapped with the account password and a recovery code.',
      'A Cyber Resilience Act record and a CycloneDX SBOM document the product and its dependencies.',
      'Tests run in GitHub Actions and must pass before a merge, then GitHub Pages deploys it.',
    ],
    tags: ['Web', 'React', 'Firebase', 'Security'],
    images: [],
    links: [],
    privateLabel: 'Private / salon project',
  },
  {
    id: 'four-in-a-row',
    context: 'Personal',
    title: 'Four in a row with a Minimax AI',
    problem:
      'I wanted to understand how a game AI actually decides its next move, so I built one from scratch instead of using a library.',
    solution:
      'A Connect Four game for iOS where you play against a bot with selectable difficulty, or against a friend.',
    how: [
      'Depth-limited Minimax where the search depth is the difficulty. Board positions are scored by how central they are.',
      'Alpha-beta pruning cuts away bad branches, so depth 6 and beyond runs without lag.',
      'The AI runs on a background task and hands its move back to the main actor, so the board never freezes.',
      'MVVM with @Observable, and bots behind a BotPlayer protocol so new AIs are easy to add and test.',
    ],
    tags: ['iOS', 'Swift', 'AI', 'Game'],
    images: [
      { src: fourinrowGame, alt: 'A Connect Four game in progress' },
      { src: fourinrowDifficulty, alt: 'Choosing the bot difficulty' },
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/Zapeman02/connectFour' }],
  },
  {
    id: 'bletracker',
    context: 'Personal',
    title: 'BLETracker: find a Bluetooth device by signal',
    problem:
      'You lost your headphones or watch somewhere at home. The phone can see them over Bluetooth, but it can’t tell you where they are.',
    solution:
      'An iOS app that lists nearby Bluetooth devices. Pick one and a radar shows how close you are as you walk around: red when far, yellow when closer, green when you’re there.',
    how: [
      'Built mostly for fun, to experiment with BLE before the SEPM project.',
      'CoreBluetooth scans for devices and reads their signal strength (RSSI).',
      'The raw signal jumps around, so a moving average over the last readings smooths it before it’s mapped to a 0–1 distance.',
      'SwiftUI with @Observable state. Unnamed devices can be hidden.',
    ],
    tags: ['iOS', 'Swift', 'BLE'],
    images: [
      { src: bletrackerClose, alt: 'Radar in green: you are next to the device' },
      { src: bletrackerList, alt: 'List of nearby Bluetooth devices with signal strength' },
      { src: bletrackerFar, alt: 'Radar in red: the device is far away' },
      { src: bletrackerMedium, alt: 'Radar in yellow: getting closer' },
    ],
    links: [{ label: 'GitHub', url: 'https://github.com/Zapeman02/BLETracker' }],
  },
  {
    id: 'sensor-node',
    context: 'Personal',
    inProgress: true,
    title: 'Basil sensor node on bare-metal STM32',
    problem:
      'My basil keeps dying because it can’t tell me when it needs water. I also wanted to learn embedded for real, close to the hardware, instead of only using ready-made libraries.',
    solution:
      'A sensor node on an STM32 that measures soil moisture, temperature, humidity and pressure, shows it on a small screen, and sends it over BLE to the phone and over MQTT to Home Assistant.',
    how: [
      'STM32 Nucleo (L476RG) in C. CubeMX only generates the init code; the sensor and display drivers are written by hand from the datasheets.',
      'Built step by step, experiment first: blink, UART, an 8×8 LED matrix driven through a 74HC595 shift register, and an LED bar that follows a potentiometer through the ADC.',
      'Debugged with STM32CubeIDE and a logic analyzer in PulseView.',
      'Next up: the BME280 climate sensor, the OLED display, then BLE and MQTT.',
    ],
    tags: ['Embedded', 'C', 'IoT', 'BLE'],
    images: [{ src: sensornodeMatrix, alt: 'STM32 Nucleo on a breadboard drawing a smiley on an 8×8 LED matrix' }],
    links: [],
    privateLabel: 'Personal project',
  },
  {
    id: 'arc-raiders-path',
    context: 'Personal',
    title: 'ARC Raiders Path: know what loot to keep',
    problem:
      'In ARC Raiders you never know which loot you need for your next upgrade, so you sell or recycle the exact item you needed one round later.',
    solution:
      'A companion app that shows my next goal, exactly what to bring and what to save, plus checklists for the workshop, weapons, skills and quests.',
    how: [
      'A Python script pulls public data from the ARC Tracker API and the community wiki and builds a static web app with item icons. One command rebuilds it after a game patch.',
      'A small local server saves progress to a JSON file, so I can also update it by chatting with Claude.',
      'Wrapped as a Mac app that opens straight to the tracker.',
    ],
    tags: ['Game', 'Python', 'Web'],
    images: [
      { src: arcraidersFocus, alt: 'Focus view with the next upgrade goal and the loot to save for it' },
      { src: arcraidersLoot, alt: 'Loot check: what to keep, save or sell, with search' },
      { src: arcraidersSkills, alt: 'Skill tree with a recommended path' },
      { src: arcraidersWeapons, alt: 'Recommended weapon loadouts' },
      { src: arcraidersWorkshop, alt: 'Workshop stations with upgrade levels and required materials' },
    ],
    links: [],
    privateLabel: 'Personal tool',
  },
]
