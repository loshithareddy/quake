import { format } from "date-fns";
import type { Earthquake } from "@/lib/types";

interface SidebarProps {
  earthquakes?: Earthquake[];
}

const Sidebar = ({ earthquakes }: SidebarProps) => {
  return (
    <aside className="w-96 bg-forest-light border-r border-mint/20 p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold text-mint mb-4">Recent Earthquakes</h2>
      <div className="space-y-4">
        {earthquakes?.map((eq) => (
          <div
            key={eq.id}
            className="p-4 rounded-lg bg-forest border border-mint/20 hover:border-mint/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-mint">
                Magnitude {eq.magnitude}
              </span>
              <span className="text-sm text-white/60">
                {format(new Date(eq.time), "PPp")}
              </span>
            </div>
            <p className="text-white/80 mb-1">{eq.place}</p>
            <p className="text-sm text-white/60">Depth: {eq.depth}km</p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;