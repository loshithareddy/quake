import type { Earthquake } from "./types";

const SOURCES = {
  USGS: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  EMSC: "https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=100",
  IMD: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&limit=100&minlatitude=8.4&maxlatitude=37.6&minlongitude=68.7&maxlongitude=97.25",
  IRIS: "https://service.iris.edu/fdsnws/event/1/query?format=text&orderby=time&limit=100&starttime=2024-01-01&minlatitude=8.4&maxlatitude=37.6&minlongitude=68.7&maxlongitude=97.25&minmagnitude=2.5"
};

async function fetchFromSource(source: string, url: string): Promise<Earthquake[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch from ${source}`);
    const data = await response.json();

    switch (source) {
      case "USGS":
        return data.features.map((feature: any) => ({
          id: feature.id,
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          depth: feature.geometry.coordinates[2],
          source: "USGS"
        }));
      
      case "EMSC":
        return data.features.map((feature: any) => ({
          id: feature.properties.unid,
          magnitude: feature.properties.mag,
          place: feature.properties.flynn_region,
          time: new Date(feature.properties.time).getTime(),
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          depth: feature.geometry.coordinates[2],
          source: "EMSC"
        }));
      
      case "IMD":
        return data.features.map((feature: any) => ({
          id: feature.id,
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          depth: feature.geometry.coordinates[2],
          source: "IMD"
        }));

      case "IRIS":
        // Parse IRIS text format response
        const lines = data.split('\n');
        return lines
          .filter((line: string) => line.trim() && !line.startsWith('#'))
          .map((line: string, index: number) => {
            const [time, latitude, longitude, depth, magnitude, , place] = line.split('|').map(s => s.trim());
            return {
              id: `iris-${index}`,
              magnitude: parseFloat(magnitude),
              place: place || 'Unknown Location',
              time: new Date(time).getTime(),
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
              depth: parseFloat(depth),
              source: "IRIS"
            };
          });

      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return [];
  }
}

export async function fetchEarthquakes(): Promise<Earthquake[]> {
  const promises = Object.entries(SOURCES).map(([source, url]) => 
    fetchFromSource(source, url)
  );

  const results = await Promise.all(promises);
  const allEarthquakes = results.flat();

  // Sort by time, most recent first
  return allEarthquakes.sort((a, b) => b.time - a.time);
}