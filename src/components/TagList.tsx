interface TagListProps {
  tags: string[]
  label: string
}

export function TagList({ tags, label }: TagListProps) {
  return (
    <ul className="tags" aria-label={label}>
      {tags.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  )
}
