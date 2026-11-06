import calendar from '../data/contributions.json'

export interface ContributionDay {
  date: string
  count: number
}

export interface ContributionCalendar {
  total: number
  weeks: ContributionDay[][]
}

const RECENT_WEEKS = 22

const level = (count: number, max: number) => (count === 0 ? 0 : Math.ceil((count / max) * 4))

export function Contributions({ data = calendar }: { data?: ContributionCalendar }) {
  const weeks = data.weeks.slice(-RECENT_WEEKS)
  const days = weeks.flat()
  if (days.length === 0) return null
  const max = Math.max(1, ...days.map((d) => d.count))

  return (
    <figure className="contrib">
      <figcaption>
        <span className="contrib-label">GitHub activity</span>
        <span className="contrib-total">{data.total} public contributions in the last year</span>
      </figcaption>
      <div className="contrib-grid" role="img" aria-label={`GitHub activity for the last ${weeks.length} weeks`}>
        {weeks.map((week) => (
          <div key={week[0].date} className="contrib-week">
            {week.map((day) => (
              <span
                key={day.date}
                className={`contrib-day level-${level(day.count, max)}`}
                title={`${day.count} on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>
    </figure>
  )
}
