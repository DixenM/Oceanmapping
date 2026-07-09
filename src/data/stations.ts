import { TideStation } from '../types'

export const danishTideStations: TideStation[] = [
  {
    id: 'copenhagen',
    name: 'København (Havnegade)',
    latitude: 55.6761,
    longitude: 12.5872,
    city: 'Copenhagen',
    region: 'Zealand'
  },
  {
    id: 'esbjerg',
    name: 'Esbjerg Havn',
    latitude: 55.4677,
    longitude: 8.4380,
    city: 'Esbjerg',
    region: 'South Jutland'
  },
  {
    id: 'aalborg',
    name: 'Aalborg',
    latitude: 57.0488,
    longitude: 9.9217,
    city: 'Aalborg',
    region: 'North Jutland'
  },
  {
    id: 'aarhus',
    name: 'Aarhus Havn',
    latitude: 56.1496,
    longitude: 10.2134,
    city: 'Aarhus',
    region: 'East Jutland'
  },
  {
    id: 'odense',
    name: 'Odense Fjord',
    latitude: 55.4760,
    longitude: 10.5142,
    city: 'Odense',
    region: 'Funen'
  },
  {
    id: 'skagen',
    name: 'Skagen Havn',
    latitude: 57.7209,
    longitude: 10.5839,
    city: 'Skagen',
    region: 'North Jutland'
  },
  {
    id: 'helsingor',
    name: 'Helsingør',
    latitude: 56.0346,
    longitude: 12.6137,
    city: 'Helsingør',
    region: 'North Zealand'
  },
  {
    id: 'frederikshavn',
    name: 'Frederikshavn',
    latitude: 57.4389,
    longitude: 10.5360,
    city: 'Frederikshavn',
    region: 'North Jutland'
  },
  {
    id: 'ronne',
    name: 'Rønne (Bornholm)',
    latitude: 55.0999,
    longitude: 14.6956,
    city: 'Rønne',
    region: 'Bornholm'
  },
  {
    id: 'korsor',
    name: 'Korsør',
    latitude: 55.3299,
    longitude: 11.1397,
    city: 'Korsør',
    region: 'Zealand'
  },
  {
    id: 'hirtshals',
    name: 'Hirtshals',
    latitude: 57.5953,
    longitude: 9.9630,
    city: 'Hirtshals',
    region: 'North Jutland'
  },
  {
    id: 'gedser',
    name: 'Gedser',
    latitude: 54.5741,
    longitude: 11.9297,
    city: 'Gedser',
    region: 'South Zealand'
  },
  {
    id: 'thyboron',
    name: 'Thyborøn',
    latitude: 56.7049,
    longitude: 8.2132,
    city: 'Thyborøn',
    region: 'West Jutland'
  },
  {
    id: 'romo',
    name: 'Rømø',
    latitude: 55.1525,
    longitude: 8.5394,
    city: 'Rømø',
    region: 'South Jutland'
  },
  {
    id: 'svendborg',
    name: 'Svendborg',
    latitude: 55.0596,
    longitude: 10.6069,
    city: 'Svendborg',
    region: 'South Funen'
  }
]

export const getCityStations = (cityName: string): TideStation[] => {
  const normalized = cityName.toLowerCase().trim()
  return danishTideStations.filter(station => 
    station.city.toLowerCase().includes(normalized) ||
    station.name.toLowerCase().includes(normalized)
  )
}

export const getStationById = (id: string): TideStation | undefined => {
  return danishTideStations.find(station => station.id === id)
}

export const getStationByName = (name: string): TideStation | undefined => {
  const normalized = name.toLowerCase().trim()
  return danishTideStations.find(station => 
    station.name.toLowerCase() === normalized ||
    station.city.toLowerCase() === normalized
  )
}
