import { describe, expect, it } from 'vitest'
import { projects } from './projects'

describe('projects data', () => {
  it('has unique ids', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(projects)('$id has all required fields', (project) => {
    expect(project.title.trim()).not.toBe('')
    expect(project.problem.trim()).not.toBe('')
    expect(project.solution.trim()).not.toBe('')
    expect(project.how.length).toBeGreaterThan(0)
    expect(project.tags.length).toBeGreaterThan(0)
  })

  it.each(projects)('$id has https links with labels', (project) => {
    for (const link of project.links) {
      expect(link.label.trim()).not.toBe('')
      expect(new URL(link.url).protocol).toBe('https:')
    }
  })

  it.each(projects)('$id images have alt text', (project) => {
    for (const image of project.images) {
      expect(image.alt.trim()).not.toBe('')
    }
  })
})
