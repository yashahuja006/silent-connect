import { useCallback } from 'react'

export const useSound = () => {
  const playPop = useCallback(() => {
    try {
      const audio = new Audio('/sounds/pop.mp3')
      audio.volume = 0.5
      audio.play().catch(error => {
        console.warn('Could not play pop sound:', error)
      })
    } catch (error) {
      console.warn('Pop sound file not found:', error)
    }
  }, [])

  const playSuccess = useCallback(() => {
    try {
      const audio = new Audio('/sounds/success.mp3')
      audio.volume = 0.7
      audio.play().catch(error => {
        console.warn('Could not play success sound:', error)
      })
    } catch (error) {
      console.warn('Success sound file not found:', error)
    }
  }, [])

  const playGameOver = useCallback(() => {
    try {
      const audio = new Audio('/sounds/gameover.mp3')
      audio.volume = 0.6
      audio.play().catch(error => {
        console.warn('Could not play game over sound:', error)
      })
    } catch (error) {
      console.warn('Game over sound file not found:', error)
    }
  }, [])

  return { playPop, playSuccess, playGameOver }
}