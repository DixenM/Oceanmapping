/**
 * Danish Tide Stations
 * Major tide monitoring locations along the Danish coast
 * Coordinates and metadata for tide stations
 */

export const danishStations = [
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    nameLocal: 'København',
    lat: 55.6761,
    lon: 12.5683,
    description: 'Capital city, Øresund strait',
    type: 'major',
    region: 'Zealand'
  },
  {
    id: 'esbjerg',
    name: 'Esbjerg',
    nameLocal: 'Esbjerg',
    lat: 55.4670,
    lon: 8.4380,
    description: 'Major North Sea port',
    type: 'major',
    region: 'Jutland'
  },
  {
    id: 'aarhus',
    name: 'Aarhus',
    nameLocal: 'Aarhus',
    lat: 56.1629,
    lon: 10.2039,
    description: 'Kattegat coast, second largest city',
    type: 'major',
    region: 'Jutland'
  },
  {
    id: 'skagen',
    name: 'Skagen',
    nameLocal: 'Skagen',
    lat: 57.7210,
    lon: 10.5830,
    description: 'Northern tip, where seas meet',
    type: 'major',
    region: 'Jutland'
  },
  {
    id: 'aalborg',
    name: 'Aalborg',
    nameLocal: 'Aalborg',
    lat: 57.0488,
    lon: 9.9217,
    description: 'Limfjorden strait',
    type: 'major',
    region: 'Jutland'
  },
  {
    id: 'korsor',
    name: 'Korsør',
    nameLocal: 'Korsør',
    lat: 55.3297,
    lon: 11.1380,
    description: 'Great Belt strait',
    type: 'secondary',
    region: 'Zealand'
  },
  {
    id: 'gedser',
    name: 'Gedser',
    nameLocal: 'Gedser',
    lat: 54.5731,
    lon: 11.9290,
    description: 'Southern tip of Denmark',
    type: 'secondary',
    region: 'Zealand'
  },
  {
    id: 'helsingør',
    name: 'Helsingør',
    nameLocal: 'Helsingør',
    lat: 56.0363,
    lon: 12.6136,
    description: 'Øresund, near Sweden',
    type: 'secondary',
    region: 'Zealand'
  },
  {
    id: 'fredericia',
    name: 'Fredericia',
    nameLocal: 'Fredericia',
    lat: 55.5636,
    lon: 9.7520,
    description: 'Little Belt strait',
    type: 'secondary',
    region: 'Jutland'
  },
  {
    id: 'hirtshals',
    name: 'Hirtshals',
    nameLocal: 'Hirtshals',
    lat: 57.5940,
    lon: 9.9617,
    description: 'North Sea fishing port',
    type: 'secondary',
    region: 'Jutland'
  },
  {
    id: 'rønne',
    name: 'Rønne',
    nameLocal: 'Rønne',
    lat: 55.0985,
    lon: 14.7084,
    description: 'Bornholm island, Baltic Sea',
    type: 'secondary',
    region: 'Bornholm'
  }
]

export const getStationById = (id) => {
  return danishStations.find(station => station.id === id)
}

export const getStationsByRegion = (region) => {
  return danishStations.filter(station => station.region === region)
}

export const getMajorStations = () => {
  return danishStations.filter(station => station.type === 'major')
}
