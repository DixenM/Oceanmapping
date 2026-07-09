import { TideInfo, TideData, TideStatus } from '../types'

const WORLDTIDES_API_KEY = import.meta.env.VITE_WORLDTIDES_API_KEY || 'demo'
const API_BASE_URL = 'https://www.worldtides.info/api/v3'

export const fetchTideData = async (
  latitude: number,
  longitude: number
): Promise<TideInfo> => {
  try {
    const now = new Date()
    const start = Math.floor(now.getTime() / 1000) - 86400

    const response = await fetch(
      `${API_BASE_URL}?extremes&heights&lat=${latitude}&lon=${longitude}&start=${start}&length=${86400 * 2}&key=${WORLDTIDES_API_KEY}`
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.extremes || data.extremes.length === 0) {
      throw new Error('No tide data available')
    }

    const currentHeight = data.heights?.[0]?.height || 0
    const currentTime = data.heights?.[0]?.dt || now.toISOString()

    const extremes: TideData[] = data.extremes.map((extreme: any) => ({
      height: extreme.height,
      time: new Date(extreme.dt * 1000).toISOString(),
      type: extreme.type === 'High' ? 'High' : 'Low'
    }))

    const status = calculateTideStatus(currentHeight, extremes, currentTime)

    return {
      current: {
        height: currentHeight,
        time: currentTime
      },
      extremes: extremes.slice(0, 6),
      status
    }
  } catch (error) {
    console.error('Error fetching tide data:', error)
    throw error
  }
}

const calculateTideStatus = (
  _currentHeight: number,
  extremes: TideData[],
  currentTime: string
): TideStatus => {
  if (extremes.length < 2) {
    return {
      state: 'rising',
      message: 'Data unavailable',
      color: '#6b7280',
      icon: '〰️'
    }
  }

  const current = new Date(currentTime).getTime()
  
  let prevExtreme: TideData | null = null
  let nextExtreme: TideData | null = null

  for (let i = 0; i < extremes.length - 1; i++) {
    const extremeTime = new Date(extremes[i].time).getTime()
    const nextExtremeTime = new Date(extremes[i + 1].time).getTime()

    if (extremeTime <= current && current <= nextExtremeTime) {
      prevExtreme = extremes[i]
      nextExtreme = extremes[i + 1]
      break
    }
  }

  if (!prevExtreme || !nextExtreme) {
    return {
      state: 'rising',
      message: 'Calculating...',
      color: '#6b7280',
      icon: '〰️'
    }
  }

  const prevTime = new Date(prevExtreme.time).getTime()
  const nextTime = new Date(nextExtreme.time).getTime()
  const progress = (current - prevTime) / (nextTime - prevTime)

  if (prevExtreme.type === 'Low' && nextExtreme.type === 'High') {
    if (progress < 0.15) {
      return {
        state: 'low',
        message: 'Low Tide',
        color: '#ef4444',
        icon: '⬇️'
      }
    }
    return {
      state: 'rising',
      message: 'Rising',
      color: '#3b82f6',
      icon: '↗️'
    }
  } else {
    if (progress < 0.15) {
      return {
        state: 'high',
        message: 'High Tide',
        color: '#10b981',
        icon: '⬆️'
      }
    }
    return {
      state: 'falling',
      message: 'Falling',
      color: '#f59e0b',
      icon: '↘️'
    }
  }
}
