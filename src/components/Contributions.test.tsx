import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Contributions } from './Contributions'

const week = (start: number, counts: number[]) =>
  counts.map((count, i) => ({ date: `2026-01-${String(start + i).padStart(2, '0')}`, count }))

describe('Contributions', () => {
  it('renders one cell per day', () => {
    const data = { total: 9, weeks: [week(1, [0, 1, 2, 0, 0, 3, 0]), week(8, [3])] }
    const { container } = render(<Contributions data={data} />)
    expect(container.querySelectorAll('.contrib-day')).toHaveLength(8)
    expect(screen.getByText('9 contributions in the last year')).toBeInTheDocument()
  })

  it('scales levels to the busiest day', () => {
    const data = { total: 5, weeks: [week(1, [0, 1, 4])] }
    const { container } = render(<Contributions data={data} />)
    const levels = [...container.querySelectorAll('.contrib-day')].map((el) => el.className)
    expect(levels).toEqual(['contrib-day level-0', 'contrib-day level-1', 'contrib-day level-4'])
  })

  it('shows only the most recent weeks', () => {
    const data = { total: 0, weeks: Array.from({ length: 30 }, (_, i) => week(1, [0]).map((d) => ({ ...d, date: `w${i}` }))) }
    const { container } = render(<Contributions data={data} />)
    expect(container.querySelectorAll('.contrib-day')).toHaveLength(22)
  })

  it('renders nothing without data', () => {
    const { container } = render(<Contributions data={{ total: 0, weeks: [] }} />)
    expect(container).toBeEmptyDOMElement()
  })
})
