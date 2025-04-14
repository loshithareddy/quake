
import { useState } from "react";
import { format } from "date-fns";
import { Activity, Filter, Search, AlertCircle } from "lucide-react";
import type { Earthquake } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RecentEarthquakesListProps {
  earthquakes?: Earthquake[];
}

const RecentEarthquakesList = ({ earthquakes }: RecentEarthquakesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [minMagnitude, setMinMagnitude] = useState<number | null>(null);

  if (!earthquakes || earthquakes.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <div className="flex items-center mb-6">
          <Activity className="text-forest mr-2" />
          <h2 className="text-xl font-bold text-forest">Recent Earthquakes</h2>
        </div>
        <div className="p-10 text-center text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No earthquake data available</p>
        </div>
      </div>
    );
  }

  // Filter earthquakes based on search term and minimum magnitude
  const filteredEarthquakes = earthquakes.filter(eq => {
    const matchesSearch = eq.place.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMagnitude = minMagnitude ? eq.magnitude >= minMagnitude : true;
    return matchesSearch && matchesMagnitude;
  });

  // Sort by time (most recent first)
  const sortedEarthquakes = [...filteredEarthquakes].sort((a, b) => b.time - a.time);
  
  // Take only the 10 most recent for display
  const recentEarthquakes = sortedEarthquakes.slice(0, 10);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Activity className="text-forest mr-2" />
          <h2 className="text-xl font-bold text-forest">Recent Earthquakes</h2>
        </div>
        <span className="text-sm text-gray-500">
          {earthquakes.length} earthquakes detected
        </span>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <Button 
            variant={minMagnitude === null ? "outline" : "default"}
            size="sm"
            onClick={() => setMinMagnitude(null)}
            className={minMagnitude === null ? "bg-forest/10 text-forest" : "bg-forest text-white"}
          >
            All
          </Button>
          <Button 
            variant={minMagnitude === 3 ? "default" : "outline"}
            size="sm"
            onClick={() => setMinMagnitude(3)}
            className={minMagnitude === 3 ? "bg-forest text-white" : ""}
          >
            3.0+
          </Button>
          <Button 
            variant={minMagnitude === 4.5 ? "default" : "outline"}
            size="sm"
            onClick={() => setMinMagnitude(4.5)}
            className={minMagnitude === 4.5 ? "bg-red-500 text-white" : ""}
          >
            4.5+
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-3 text-left font-medium text-gray-500">Magnitude</th>
              <th className="py-2 px-3 text-left font-medium text-gray-500">Location</th>
              <th className="py-2 px-3 text-left font-medium text-gray-500">Time</th>
              <th className="py-2 px-3 text-left font-medium text-gray-500">Depth</th>
              <th className="py-2 px-3 text-left font-medium text-gray-500">Source</th>
            </tr>
          </thead>
          <tbody>
            {recentEarthquakes.map((eq) => (
              <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-3">
                  <span className={`inline-block w-12 text-center py-1 px-2 rounded-full font-medium ${
                    eq.magnitude >= 5 ? 'bg-red-100 text-red-800' :
                    eq.magnitude >= 4 ? 'bg-orange-100 text-orange-800' :
                    eq.magnitude >= 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {eq.magnitude.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-3">{eq.place}</td>
                <td className="py-3 px-3">{format(new Date(eq.time), "MMM d, h:mm a")}</td>
                <td className="py-3 px-3">{eq.depth} km</td>
                <td className="py-3 px-3">
                  <span className="inline-block py-1 px-2 bg-gray-100 rounded text-xs">
                    {eq.source || "USGS"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentEarthquakesList;
