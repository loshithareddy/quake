
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Ruler, Calendar, ArrowUpDown, BarChart2, LineChart as LineChartIcon } from "lucide-react";

// Mock historical data
const historicalData = [
  { year: "2017", events: 45, avgMagnitude: 3.2, maxMagnitude: 5.8 },
  { year: "2018", events: 52, avgMagnitude: 3.4, maxMagnitude: 6.2 },
  { year: "2019", events: 38, avgMagnitude: 3.1, maxMagnitude: 5.5 },
  { year: "2020", events: 61, avgMagnitude: 3.5, maxMagnitude: 6.7 },
  { year: "2021", events: 49, avgMagnitude: 3.3, maxMagnitude: 5.9 },
  { year: "2022", events: 57, avgMagnitude: 3.4, maxMagnitude: 6.1 },
  { year: "2023", events: 63, avgMagnitude: 3.6, maxMagnitude: 6.5 },
  { year: "2024", events: 28, avgMagnitude: 3.2, maxMagnitude: 5.6 },
];

// Mock monthly data for current year
const monthlyData2024 = [
  { month: "Jan", events: 8, avgMagnitude: 3.1, maxMagnitude: 5.2 },
  { month: "Feb", events: 6, avgMagnitude: 3.0, maxMagnitude: 4.8 },
  { month: "Mar", events: 9, avgMagnitude: 3.4, maxMagnitude: 5.6 },
  { month: "Apr", events: 5, avgMagnitude: 3.2, maxMagnitude: 4.9 },
];

const HistoricalDataComparison = () => {
  const [timeFrame, setTimeFrame] = useState<"yearly" | "monthly">("yearly");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [metric, setMetric] = useState<"events" | "avgMagnitude" | "maxMagnitude">("events");

  const data = timeFrame === "yearly" ? historicalData : monthlyData2024;
  const timeKey = timeFrame === "yearly" ? "year" : "month";

  const metricLabel = {
    events: "Number of Events",
    avgMagnitude: "Average Magnitude",
    maxMagnitude: "Maximum Magnitude"
  };

  const metricColors = {
    events: "#1EAEDB",
    avgMagnitude: "#FDE1D3",
    maxMagnitude: "#E5DEFF"
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="text-forest mr-2" />
          <h2 className="text-xl font-bold text-forest">Historical Comparison</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={timeFrame === "yearly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("yearly")}
            className={timeFrame === "yearly" ? "bg-forest text-white" : ""}
          >
            Yearly
          </Button>
          <Button
            variant={timeFrame === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFrame("monthly")}
            className={timeFrame === "monthly" ? "bg-forest text-white" : ""}
          >
            Monthly (2024)
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex space-x-2 mb-2 sm:mb-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMetric("events")}
            className={metric === "events" ? "border-forest text-forest" : ""}
          >
            Events
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMetric("avgMagnitude")}
            className={metric === "avgMagnitude" ? "border-forest text-forest" : ""}
          >
            Avg. Magnitude
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMetric("maxMagnitude")}
            className={metric === "maxMagnitude" ? "border-forest text-forest" : ""}
          >
            Max. Magnitude
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChartType("line")}
            className={chartType === "line" ? "border-forest" : ""}
          >
            <LineChartIcon className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setChartType("bar")}
            className={chartType === "bar" ? "border-forest" : ""}
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Bar
          </Button>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={timeKey} stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={metric}
                name={metricLabel[metric]}
                stroke={metricColors[metric]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={timeKey} stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <Legend />
              <Bar
                dataKey={metric}
                name={metricLabel[metric]}
                fill={metricColors[metric]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-forest/5 rounded-lg">
        <div className="flex items-center">
          <ArrowUpDown className="h-4 w-4 text-forest mr-2" />
          <span className="text-sm font-medium text-forest">Key Insights:</span>
        </div>
        <p className="text-sm text-forest/80 mt-1">
          {metric === "events" 
            ? "Seismic activity has shown an upward trend since 2019, with 2023 recording the highest number of events."
            : metric === "avgMagnitude"
            ? "Average earthquake magnitude has remained relatively stable between 3.1 and 3.6 over the past 7 years."
            : "The maximum recorded magnitude peaked in 2020 at 6.7, with another significant peak in 2023 at 6.5."}
        </p>
      </div>
    </div>
  );
};

export default HistoricalDataComparison;
