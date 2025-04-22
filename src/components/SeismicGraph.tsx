
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
    <div className="w-full h-48 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="time" 
            stroke="#222222"
            fontSize={10}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis 
            stroke="#222222"
            fontSize={10}
            label={{ 
              value: 'Magnitude', 
              angle: -90, 
              position: 'insideLeft', 
              fill: '#222222',
              fontSize: 12
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '8px',
              color: '#222222'
            }}
            labelStyle={{ color: '#222222' }}
            itemStyle={{ color: '#222222' }}
            formatter={(value: any, name: string) => [
              value, 
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="magnitude" 
            stroke="#1EAEDB"
            strokeWidth={2}
            dot={{ 
              fill: '#1EAEDB', 
              r: 4,
              strokeWidth: 2
            }}
            activeDot={{
              r: 6,
              stroke: '#1EAEDB',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SeismicGraph;
