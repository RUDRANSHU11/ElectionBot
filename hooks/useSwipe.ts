import { useRef } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

/** Returns touch handlers to spread onto an element: {...useSwipe({ onSwipeLeft })} */
export function useSwipe({ onSwipeLeft, onSwipeRight, onSwipeDown, threshold = 60 }: SwipeOptions) {
  const start = useRef<{ x: number; y: number } | null>(null)

  return {
    onTouchStart: (e: React.TouchEvent) => {
      start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (!start.current) return
      const dx = e.changedTouches[0].clientX - start.current.x
      const dy = e.changedTouches[0].clientY - start.current.y
      start.current = null
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < -threshold) onSwipeLeft?.()
        else if (dx > threshold) onSwipeRight?.()
      } else if (dy > threshold) {
        onSwipeDown?.()
      }
    },
  }
}
