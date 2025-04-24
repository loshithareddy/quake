
import { Clock } from "lucide-react";
import type { Earthquake } from "@/lib/types";
import { useState, useEffect } from "react";
import { EmergencyContacts } from "./sidebar/EmergencyContacts";
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
    <aside className="w-full md:w-96 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto shadow-sm">
      <div className="mb-6 text-center">
        <Clock className="inline-block mr-2 text-gray-500" />
        <span className="text-lg font-semibold text-gray-700">
          {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
        <div className="text-sm text-gray-500">India Standard Time</div>
      </div>

      {!user && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-700 mb-2">Sign in to receive personalized earthquake alerts</p>
          <Link to="/auth">
            <Button variant="outline" className="w-full text-gray-700 border-gray-300 hover:bg-gray-100">
              Sign In / Register
            </Button>
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {user && <AlertNotifications />}
        <StateSeismicData />
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
