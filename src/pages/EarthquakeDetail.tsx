
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import { AlertTriangle, ArrowLeft, Share2, Bookmark, MapPin, Calendar, Clock, Ruler } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Earthquake } from "@/lib/types";
import SeismicGraph from "@/components/SeismicGraph";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

const EarthquakeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [earthquake, setEarthquake] = useState<Earthquake | null>(null);
  
  const { data: earthquakes, error } = useQuery({
    queryKey: ["earthquakes"],
    queryFn: fetchEarthquakes,
  });

  useEffect(() => {
    if (earthquakes) {
      const foundEarthquake = earthquakes.find(eq => eq.id === id);
      setEarthquake(foundEarthquake || null);
    }
  }, [earthquakes, id]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch earthquake data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Earthquake: ${earthquake?.place}`,
        text: `Magnitude ${earthquake?.magnitude} earthquake at ${earthquake?.place}`,
        url: window.location.href,
      }).catch(() => {
        toast({
          title: "Share failed",
          description: "Could not share this information",
        });
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Earthquake details link copied to clipboard",
      });
    }
  };

  const handleSaveForLater = () => {
    toast({
      title: "Saved",
      description: "Earthquake details saved to your profile",
    });
  };

  if (!earthquake) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
        <div className="text-center p-6">
          <AlertTriangle className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
          <h1 className="text-2xl font-bold text-indigo-900 mb-2">Earthquake not found</h1>
          <p className="text-indigo-600/70 mb-6">The earthquake details you're looking for could not be found.</p>
          <Link to="/">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const dateFormatted = format(new Date(earthquake.time), "MMMM dd, yyyy");
  const timeFormatted = format(new Date(earthquake.time), "HH:mm:ss");
  const isSignificant = earthquake.magnitude >= 6.0;

  return (
    <div className="bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2] min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {isSignificant && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Significant Earthquake</AlertTitle>
            <AlertDescription>
              This is a significant seismic event that may have caused damage or casualties.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-2">
                  {earthquake.place}
                </h1>
                <div className="flex items-center text-indigo-600/70 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    Coordinates: {earthquake.latitude.toFixed(4)}, {earthquake.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleShare} className="border-indigo-200 hover:bg-indigo-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveForLater} className="border-indigo-200 hover:bg-indigo-50">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-indigo-600/70">Magnitude</div>
                <div className={`text-2xl font-bold ${earthquake.magnitude >= 5 ? 'text-red-500' : 'text-indigo-700'}`}>
                  {earthquake.magnitude.toFixed(1)}
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-indigo-600/70">Depth</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {earthquake.depth.toFixed(1)} km
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-sm text-indigo-600/70">Source</div>
                <div className="text-2xl font-bold text-indigo-700">
                  {earthquake.source || "USGS"}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-indigo-800 mb-3">Event Timeline</h2>
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                <span>{dateFormatted}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-indigo-600" />
                <span>{timeFormatted} UTC</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-indigo-800 mb-3">Seismic Activity Graph</h2>
              <div className="h-64 bg-indigo-50 p-4 rounded-lg">
                <SeismicGraph earthquakes={[earthquake]} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-800 mb-3">Technical Details</h2>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">ID</TableCell>
                    <TableCell>{earthquake.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Magnitude Type</TableCell>
                    <TableCell>ML (Richter)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    <TableCell>Reviewed</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tsunami Potential</TableCell>
                    <TableCell>{earthquake.magnitude >= 7.0 ? "Possible" : "Unlikely"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Felt Reports</TableCell>
                    <TableCell>--</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-800 mb-3">Risk Assessment</h2>
              <div className={`p-4 rounded-lg ${
                earthquake.magnitude >= 6.0 ? 'bg-red-50 border border-red-100' : 
                earthquake.magnitude >= 4.5 ? 'bg-amber-50 border border-amber-100' : 
                'bg-green-50 border border-green-100'
              }`}>
                <h3 className="font-medium text-indigo-800 mb-2">
                  {earthquake.magnitude >= 6.0 ? 'High Risk' : 
                   earthquake.magnitude >= 4.5 ? 'Moderate Risk' : 
                   'Low Risk'}
                </h3>
                <p className="text-sm">
                  {earthquake.magnitude >= 6.0 ? 
                    'This earthquake may have caused significant damage. Check local news for updates.' : 
                   earthquake.magnitude >= 4.5 ? 
                    'This earthquake may have been widely felt but likely caused limited damage.' : 
                    'This earthquake was likely only detected by instruments or felt by people near the epicenter.'}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-800 mb-3">Nearby Events</h2>
              <div className="space-y-2">
                {earthquakes?.filter(eq => eq.id !== earthquake.id)
                  .slice(0, 3)
                  .map(eq => (
                    <Link 
                      key={eq.id} 
                      to={`/earthquake/${eq.id}`}
                      className="block p-3 border border-indigo-100 rounded-lg hover:bg-indigo-50"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{eq.place}</span>
                        <span className={`${eq.magnitude >= 5 ? 'text-red-500' : 'text-indigo-700'}`}>
                          M{eq.magnitude.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-indigo-600/70">
                        {format(new Date(eq.time), "MMM dd, yyyy")}
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeDetail;
