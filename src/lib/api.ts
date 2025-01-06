import type { Earthquake } from "./types";

export async function fetchEarthquakes(): Promise<Earthquake[]> {
  const response = await fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch earthquake data");
  }

  const data = await response.json();
  
  return data.features.map((feature: any) => ({
    id: feature.id,
    magnitude: feature.properties.mag,
    place: feature.properties.place,
    time: feature.properties.time,
    latitude: feature.geometry.coordinates[1],
    longitude: feature.geometry.coordinates[0],
    depth: feature.geometry.coordinates[2],
  }));
}