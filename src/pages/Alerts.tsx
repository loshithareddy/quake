import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, BellOff, Clock, MapPin, Settings, 
  MessageSquareWarning, RefreshCw, AlertTriangle,
  Info, Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { fetchEarthquakes } from "@/lib/api";
import { format } from "date-fns";
import type { Earthquake } from "@/lib/types";

const Alerts = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState("");
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [recentAlerts, setRecentAlerts] = useState<{ 
    id: string; 
    title: string; 
    magnitude: number; 
    place: string; 
    time: number; 
    severity: 'low' | 'medium' | 'high' 
  }[]>([]);
  
  const [alertTypes, setAlertTypes] = useState({
    immediate: true,
    daily: false,
    weekly: false,
    significant: true,
    all: false,
  });

  const { data: earthquakes, refetch, isLoading } = useQuery({
    queryKey: ["earthquakes-alerts"],
    queryFn: fetchEarthquakes,
    refetchInterval: 60000,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
      setLastUpdateTime(new Date());
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  useEffect(() => {
    if (!earthquakes || !alertTypes.immediate) return;
    
    const sixHoursAgo = Date.now() - 6 * 60 * 60 * 1000;
    const significantQuakes = earthquakes.filter(eq => {
      const isRecent = eq.time > sixHoursAgo;
      const hasMagnitude = alertTypes.all ? 
        eq.magnitude >= 2.5 : 
        eq.magnitude >= 4.5;
        
      return isRecent && hasMagnitude;
    });
    
    const newAlerts = significantQuakes.map(eq => ({
      id: eq.id,
      title: `M${eq.magnitude.toFixed(1)} Earthquake Detected`,
      magnitude: eq.magnitude,
      place: eq.place,
      time: eq.time,
      severity: 
        eq.magnitude >= 5.0 ? 'high' as const : 
        eq.magnitude >= 4.0 ? 'medium' as const : 
        'low' as const
    }));
    
    if (newAlerts.length > 0) {
      const existingIds = new Set(recentAlerts.map(alert => alert.id));
      const filteredNewAlerts = newAlerts
        .filter(alert => !existingIds.has(alert.id))
        .slice(0, 5);
      
      if (filteredNewAlerts.length > 0) {
        setRecentAlerts(prevAlerts => 
          [...filteredNewAlerts, ...prevAlerts].slice(0, 10)
        );
        
        const mostSignificantAlert = filteredNewAlerts.sort((a, b) => b.magnitude - a.magnitude)[0];
        if (mostSignificantAlert && alertTypes.immediate) {
          toast({
            title: mostSignificantAlert.title,
            description: `${mostSignificantAlert.place} at ${format(new Date(mostSignificantAlert.time), "h:mm a")}`,
            variant: mostSignificantAlert.severity === 'high' ? "destructive" : "default",
          });
        }
      }
    }
  }, [earthquakes, alertTypes.immediate, alertTypes.all, toast]);

  const handleSaveSettings = () => {
    toast({
      title: "Alert settings saved",
      description: "Your earthquake alert preferences have been updated.",
    });
  };
  
  const handleManualRefresh = () => {
    refetch();
    setLastUpdateTime(new Date());
    toast({
      title: "Alert data refreshed",
      description: "Earthquake data has been updated to the latest information.",
    });
  };

  const getTotalActiveAlerts = () => {
    const lastDay = Date.now() - 24 * 60 * 60 * 1000;
    return earthquakes?.filter(eq => 
      eq.time > lastDay && 
      (alertTypes.all ? eq.magnitude >= 2.5 : eq.magnitude >= 4.5)
    ).length || 0;
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Earthquake Alerts</h1>
            <p className="text-sm text-gray-500">
              Last updated: {format(lastUpdateTime, "MMM d, h:mm:ss a")}
            </p>
          </div>
          <Button
            onClick={handleManualRefresh}
            className="mt-2 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Data
          </Button>
        </div>
        
        {!user && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Sign in to get personalized alerts</AlertTitle>
            <AlertDescription>
              Create an account to receive customized earthquake alerts based on your location and preferences.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-indigo-600" />
                  Alert Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you'd like to receive earthquake alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (SMS)</label>
                  <Input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+91 98765 43210"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="inline h-4 w-4 mr-1 text-indigo-600" />
                    Location of Interest
                  </label>
                  <Input 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Delhi, India"
                    className="w-full"
                  />
                </div>
                
                <div className="pt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    <Clock className="inline h-4 w-4 mr-1 text-indigo-600" />
                    Alert Frequency
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Immediate alerts</label>
                      <Switch 
                        checked={alertTypes.immediate}
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, immediate: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Daily summary</label>
                      <Switch 
                        checked={alertTypes.daily}
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, daily: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Weekly report</label>
                      <Switch 
                        checked={alertTypes.weekly}
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, weekly: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-md font-medium text-gray-800 mb-3">
                    <MessageSquareWarning className="inline h-4 w-4 mr-1 text-indigo-600" />
                    Alert Types
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Significant earthquakes only (M 4.5+)</label>
                      <Switch 
                        checked={alertTypes.significant}
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, significant: checked, all: !checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">All detected earthquakes</label>
                      <Switch 
                        checked={alertTypes.all}
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, all: checked, significant: !checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Alert Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {alertTypes.immediate ? 
                    <Bell className="mr-2 h-5 w-5 text-green-600" /> : 
                    <BellOff className="mr-2 h-5 w-5 text-gray-400" />
                  }
                  Alert Status
                </CardTitle>
                <CardDescription>
                  Your current alert notification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg ${alertTypes.immediate ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className="text-sm">
                    {alertTypes.immediate ? (
                      <span className="font-medium text-green-800">
                        Alerts are active
                      </span>
                    ) : (
                      <span className="font-medium text-gray-500">
                        Alerts are disabled
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-1 text-gray-500">
                    {location ? `Monitoring: ${location}` : 'No specific location set'}
                  </p>
                  {alertTypes.immediate && (
                    <div className="mt-2 text-xs text-green-700">
                      <Activity className="inline-block h-3 w-3 mr-1" />
                      {isLoading ? 'Updating...' : `${getTotalActiveAlerts()} active alerts in last 24h`}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email alerts:</span> {email ? 'Configured' : 'Not set'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">SMS alerts:</span> {phone ? 'Configured' : 'Not set'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setAlertTypes({...alertTypes, immediate: !alertTypes.immediate});
                    toast({
                      title: alertTypes.immediate ? "Alerts disabled" : "Alerts enabled",
                      description: alertTypes.immediate ? 
                        "You will no longer receive earthquake alerts" : 
                        "You will now receive earthquake alerts",
                    });
                  }}
                >
                  {alertTypes.immediate ? 'Disable Alerts' : 'Enable Alerts'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Alerts</CardTitle>
                <CardDescription>Real-time earthquake notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {recentAlerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-3 rounded-lg border ${
                          alert.severity === 'high' ? 'bg-red-50 border-red-100' :
                          alert.severity === 'medium' ? 'bg-orange-50 border-orange-100' :
                          'bg-yellow-50 border-yellow-100'
                        }`}
                      >
                        <div className="flex items-start">
                          <AlertTriangle className={`mr-2 h-4 w-4 mt-0.5 ${
                            alert.severity === 'high' ? 'text-red-500' :
                            alert.severity === 'medium' ? 'text-orange-500' :
                            'text-yellow-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{alert.title}</p>
                            <p className="text-xs text-gray-600">{alert.place}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(alert.time), "MMM d, h:mm a")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <MessageSquareWarning className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No recent alerts</p>
                    <p className="text-xs mt-1 text-gray-400">
                      Alerts will appear here when significant seismic activity is detected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
