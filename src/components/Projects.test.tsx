import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Project } from '../data/projects'
import { Projects } from './Projects'

vi.mock('../data/projects', () => {
  const base = { solution: 'Solution', how: ['Step'], images: [], links: [] }
  const projects: Project[] = [
    { ...base, id: 'app', title: 'App project', problem: 'Problem A', tags: ['iOS'] },
    {
      ...base,
      id: 'iot',
      title: 'IoT project',
      problem: 'Problem B',
      tags: ['IoT'],
      links: [{ label: 'GitHub', url: 'https://github.com/example' }],
    },
  ]
  return { projects, PRIVATE_LABEL: 'Private / school project' }
})

const openCard = (title: string) => userEvent.click(screen.getByRole('button', { name: title }))

describe('Projects', () => {
  it('opens the detail view and closes it with the close button', async () => {
    render(<Projects />)
    await openCard('App project')

    const dialog = screen.getByRole('dialog', { name: 'App project' })
    expect(within(dialog).getByText('Private / school project')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'App project' })).toHaveFocus()
  })

  it('closes the detail view with Escape', async () => {
    render(<Projects />)
    await openCard('IoT project')

    const dialog = screen.getByRole('dialog', { name: 'IoT project' })
    expect(within(dialog).getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/example')

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('filters projects by tag', async () => {
    render(<Projects />)
    const filter = screen.getByRole('group', { name: /filter/i })

    await userEvent.click(within(filter).getByRole('button', { name: 'IoT' }))
    expect(screen.queryByRole('button', { name: 'App project' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'IoT project' })).toBeInTheDocument()

    await userEvent.click(within(filter).getByRole('button', { name: 'All' }))
    expect(screen.getByRole('button', { name: 'App project' })).toBeInTheDocument()
  })
})
