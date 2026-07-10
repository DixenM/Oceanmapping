export interface TideStation {
  id: string
  name: string
  latitude: number
  longitude: number
  city: string
  region: string
}

export interface TideData {
  height: number
  time: string
  type: 'High' | 'Low'
}

export interface TideInfo {
  current: {
    height: number
    time: string
  }
  extremes: TideData[]
  status: TideStatus
}

export interface TideStatus {
  state: 'rising' | 'falling' | 'high' | 'low'
  message: string
  color: string
  icon: string
}

export interface FavoriteStation {
  stationId: string
  addedAt: number
}
