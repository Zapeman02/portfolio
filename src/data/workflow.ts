export interface WorkflowStep {
  title: string
  text: string
}

export const workflowSteps: WorkflowStep[] = [
  {
    title: 'Idea → requirements',
    text: 'I start with the problem, not the code. Ideas become user stories with acceptance criteria.',
  },
  {
    title: 'Plan the contracts',
    text: 'Parts agree on interfaces before anyone builds. In SEPM I wrote the BLE protocol between our iOS app and the robot, with canonical byte frames that both Swift and Python test against.',
  },
  {
    title: 'Build in small steps',
    text: 'Feature branches, one concern per PR and code review before merge. AI agents speed me up, but they follow written project rules and I review every change.',
  },
  {
    title: 'Test and ship',
    text: 'Unit and integration tests, CI on every PR and a protected main branch. Real device runs count as customer acceptance tests, and every requirement is traced to a test.',
  },
]

export const workflowExample =
  'SEPM26: developer (iOS app + BLE) and Scrum Master in the final sprint, in a 7 person team. We built an autonomous robot (Husqvarna platform, LiDAR, RL avoidance), an iOS app and a cloud backend: 158 merged PRs, a Definition of Done and a traceability matrix. Our team was picked to present the project to visiting high school students. I presented the final demo to all classes and people from Husqvarna, which led to my thesis project with Husqvarna.'
