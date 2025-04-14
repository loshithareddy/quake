
import type { Earthquake } from "./types";

const SOURCES = {
  USGS: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
  EMSC: "https://www.seismicportal.eu/fdsnws/event/1/query?format=json&limit=100",
  IMD: "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&limit=100&minlatitude=8.4&maxlatitude=37.6&minlongitude=68.7&maxlongitude=97.25"
};

async function fetchFromSource(source: string, url: string): Promise<Earthquake[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    
    if (!response.ok) throw new Error(`Failed to fetch from ${source} (Status: ${response.status})`);
    const data = await response.json();

    // Log success for debugging
    console.log(`Successfully fetched data from ${source}`);

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

      default:
        return [];
    }
  } catch (error) {
    console.error(`Error fetching from ${source}:`, error);
    return [];
  }
}

export async function fetchEarthquakes(): Promise<Earthquake[]> {
  console.log("Fetching earthquake data from all sources...");
  
  // Use Promise.allSettled to prevent one failed source from blocking the others
  const results = await Promise.allSettled(
    Object.entries(SOURCES).map(([source, url]) => fetchFromSource(source, url))
  );
  
  // Process results, including only fulfilled promises
  const fulfilledResults = results
    .filter((result): result is PromiseFulfilledResult<Earthquake[]> => 
      result.status === 'fulfilled'
    )
    .map(result => result.value);
  
  const allEarthquakes = fulfilledResults.flat();
  
  // Log count of earthquakes fetched
  console.log(`Fetched a total of ${allEarthquakes.length} earthquakes`);
  
  // Deduplicate earthquakes by ID to handle potential overlaps between sources
  // and sort by most recent
  const uniqueEarthquakes = Array.from(
    new Map(allEarthquakes.map(eq => [eq.id, eq])).values()
  ).sort((a, b) => b.time - a.time);
  
  return uniqueEarthquakes;
}
