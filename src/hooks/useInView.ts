import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  return { ref, inView }
}
