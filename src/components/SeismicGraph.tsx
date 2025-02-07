import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Earthquake } from "@/lib/types";

interface SeismicGraphProps {
  earthquakes?: Earthquake[];
}

const SeismicGraph = ({ earthquakes }: SeismicGraphProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!earthquakes) return;
    
    const formattedData = earthquakes
      .map(eq => ({
        time: new Date(eq.time).toLocaleString(),
        magnitude: eq.magnitude,
        depth: eq.depth,
        source: eq.source
      }))
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    setData(formattedData);
  }, [earthquakes]);

  return (
    <div className="w-full h-48 bg-forest/50 border border-mint/20 rounded-lg p-4 backdrop-blur-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#64FFDA20" />
          <XAxis 
            dataKey="time" 
            stroke="#64FFDA"
            fontSize={10}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            stroke="#64FFDA"
            fontSize={10}
            label={{ 
              value: 'Magnitude', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#64FFDA',
              fontSize: 12
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0A1F2F',
              border: '1px solid #64FFDA',
              borderRadius: '8px',
              padding: '8px'
            }}
            labelStyle={{ color: '#64FFDA' }}
            itemStyle={{ color: '#64FFDA' }}
            formatter={(value: any, name: string) => [
              value, 
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="magnitude" 
            stroke="#FFD700"
            strokeWidth={2}
            dot={{ 
              fill: '#FFD700', 
              r: 4,
              strokeWidth: 2
            }}
            activeDot={{
              r: 6,
              stroke: '#64FFDA',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeismicGraph;