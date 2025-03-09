
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Clock, MapPin, Settings, MessageSquareWarning } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Alerts = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [alertTypes, setAlertTypes] = useState({
    immediate: true,
    daily: false,
    weekly: false,
    significant: true,
    all: false,
  });

  const handleSaveSettings = () => {
    toast({
      title: "Alert settings saved",
      description: "Your earthquake alert preferences have been updated.",
    });
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#E4ECF7] to-[#C3CFE2]">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">Earthquake Alerts</h1>
        
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
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, significant: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">All detected earthquakes</label>
                      <Switch 
                        checked={alertTypes.all}
                        onCheckedChange={(checked) => setAlertTypes({...alertTypes, all: checked})}
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
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-gray-500">
                  <MessageSquareWarning className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent alerts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
