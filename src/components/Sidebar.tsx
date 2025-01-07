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

interface SidebarProps {
  earthquakes?: Earthquake[];
}

const Sidebar = ({ earthquakes }: SidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside className="w-96 bg-forest-light border-r border-mint/20 p-4 overflow-y-auto">
      <div className="mb-6 text-center">
        <Clock className="inline-block mr-2 text-mint" />
        <span className="text-lg font-semibold text-mint">
          {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </span>
        <div className="text-sm text-white/60">India Standard Time</div>
      </div>

      <div className="space-y-4">
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