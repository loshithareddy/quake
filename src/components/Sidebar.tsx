
import { Clock } from "lucide-react";
import type { Earthquake } from "@/lib/types";
import { useState, useEffect } from "react";
import { EmergencyContacts } from "./sidebar/EmergencyContacts";
import { LocationSeismicData } from "./sidebar/LocationSeismicData";
import { StateSeismicData } from "./sidebar/StateSeismicData";
import { RecentEvents } from "./sidebar/RecentEvents";
import { HistoricalEvents } from "./sidebar/HistoricalEvents";
import { SafetyTips } from "./sidebar/SafetyTips";
import { FeedbackSection } from "./sidebar/FeedbackSection";
import AlertNotifications from "./AlertNotifications";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SidebarProps {
  earthquakes?: Earthquake[];
}

const Sidebar = ({ earthquakes }: SidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-full md:w-96 bg-indigo-900 border-r border-indigo-800/20 p-4 overflow-y-auto">
      <div className="mb-6 text-center">
        <Clock className="inline-block mr-2 text-indigo-300" />
        <span className="text-lg font-semibold text-indigo-100">
          {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
        <div className="text-sm text-indigo-300/60">India Standard Time</div>
      </div>

      {!user && (
        <div className="mb-4 p-3 bg-indigo-800 rounded-lg border border-indigo-700/20">
          <p className="text-indigo-100 mb-2">Sign in to receive personalized earthquake alerts</p>
          <Link to="/auth">
            <Button variant="outline" className="w-full text-indigo-200 border-indigo-700/20 hover:bg-indigo-700 hover:text-white">
              Sign In / Register
            </Button>
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {user && <AlertNotifications />}
        <LocationSeismicData earthquakes={earthquakes} />
        <StateSeismicData earthquakes={earthquakes} />
        <EmergencyContacts />
        <RecentEvents />
        <HistoricalEvents />
        <SafetyTips />
        <FeedbackSection />
      </div>
    </aside>
  );
};

export default Sidebar;
