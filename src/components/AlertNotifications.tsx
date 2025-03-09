
import { useState } from "react";
import { Bell, AlertTriangle, Settings, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const AlertNotifications = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    sms: true,
    email: true,
    app: true,
    minMagnitude: 4.5,
    regionSpecific: false,
  });
  const { toast } = useToast();

  const handleSaveSettings = () => {
    setIsDialogOpen(false);
    toast({
      title: "Alert settings saved",
      description: "Your earthquake alert preferences have been updated",
    });
  };

  const recentAlerts = [
    {
      id: "1",
      date: "2023-11-05",
      magnitude: 5.2,
      location: "Nepal-India Border",
      status: "Sent"
    },
    {
      id: "2",
      date: "2023-10-28",
      magnitude: 4.7,
      location: "Bay of Bengal",
      status: "Sent"
    },
    {
      id: "3",
      date: "2023-10-15",
      magnitude: 4.9,
      location: "Gujarat Region",
      status: "Sent"
    }
  ];

  return (
    <div className="border border-mint/20 rounded-lg">
      <div className="flex items-center justify-between p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <Bell className="mr-2" />
          Alert Notifications
        </span>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDialogOpen(true)}
            className="text-mint border-mint/20 hover:bg-forest-light hover:text-white"
          >
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
        </div>
      </div>

      <div className="p-4 border-t border-mint/20">
        <div className="p-3 bg-forest rounded-lg border border-mint/20 mb-4">
          <div className="flex items-start mb-2">
            <AlertTriangle className="h-5 w-5 text-mint mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-mint">Earthquake Alerts Active</h3>
              <p className="text-white/80 text-sm">
                You will be notified about earthquakes of magnitude {alertSettings.minMagnitude}+ in your region.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-mint/60">
              Last checked: 5 minutes ago
            </span>
            <Switch 
              checked={true} 
              className="data-[state=checked]:bg-mint data-[state=checked]:text-forest"
              disabled
            />
          </div>
        </div>

        <h3 className="font-medium text-mint mb-2">Recent Alerts</h3>
        <div className="space-y-2">
          {recentAlerts.map((alert) => (
            <div key={alert.id} className="p-2 bg-forest rounded-lg border border-mint/20">
              <div className="flex justify-between items-center">
                <span className="font-medium text-white">M{alert.magnitude} Earthquake</span>
                <span className="text-xs text-mint/80">{alert.date}</span>
              </div>
              <p className="text-sm text-white/80">{alert.location}</p>
              <div className="flex justify-end mt-1">
                <span className="text-xs px-2 py-0.5 bg-mint/20 rounded-full text-mint">
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-forest">Configure Earthquake Alerts</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="font-medium text-forest">Notification Methods</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-forest mr-2" />
                  <span>SMS Alerts</span>
                </div>
                <Switch 
                  checked={alertSettings.sms} 
                  onCheckedChange={(checked) => 
                    setAlertSettings({...alertSettings, sms: checked})
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-forest mr-2" />
                  <span>Email Notifications</span>
                </div>
                <Switch 
                  checked={alertSettings.email} 
                  onCheckedChange={(checked) => 
                    setAlertSettings({...alertSettings, email: checked})
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="h-4 w-4 text-forest mr-2" />
                  <span>In-App Notifications</span>
                </div>
                <Switch 
                  checked={alertSettings.app} 
                  onCheckedChange={(checked) => 
                    setAlertSettings({...alertSettings, app: checked})
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-forest">Alert Criteria</h3>
              <div className="space-y-2">
                <label className="block text-sm">Minimum Magnitude</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={alertSettings.minMagnitude}
                  onChange={(e) => 
                    setAlertSettings({
                      ...alertSettings, 
                      minMagnitude: parseFloat(e.target.value)
                    })
                  }
                >
                  <option value="3.0">3.0+</option>
                  <option value="4.0">4.0+</option>
                  <option value="4.5">4.5+</option>
                  <option value="5.0">5.0+</option>
                  <option value="6.0">6.0+</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Region-Specific Alerts Only</span>
                <Switch 
                  checked={alertSettings.regionSpecific} 
                  onCheckedChange={(checked) => 
                    setAlertSettings({...alertSettings, regionSpecific: checked})
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-forest text-white" onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertNotifications;
