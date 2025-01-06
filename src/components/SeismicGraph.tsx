import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Earthquake } from "@/lib/types";

interface SeismicGraphProps {
  earthquakes?: Earthquake[];
}

const SeismicGraph = ({ earthquakes }: SeismicGraphProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!earthquakes) return;
    
    const formattedData = earthquakes.map(eq => ({
      time: new Date(eq.time).toLocaleString(),
      magnitude: eq.magnitude,
      depth: eq.depth
    })).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    setData(formattedData);
  }, [earthquakes]);

  return (
    <div className="w-full h-48 bg-forest border border-mint/20 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="time" 
            stroke="#64FFDA"
            fontSize={10}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            stroke="#64FFDA"
            fontSize={10}
            label={{ value: 'Magnitude', angle: -90, position: 'insideLeft', fill: '#64FFDA' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0A1F2F',
              border: '1px solid #64FFDA',
              borderRadius: '4px'
            }}
            labelStyle={{ color: '#64FFDA' }}
            itemStyle={{ color: '#64FFDA' }}
          />
          <Line 
            type="monotone" 
            dataKey="magnitude" 
            stroke="#FFD700"
            strokeWidth={2}
            dot={{ fill: '#FFD700', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeismicGraph;