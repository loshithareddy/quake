
import { ChevronDown, Shield } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const safetyTips = [
  "Drop, Cover, and Hold On during shaking",
  "Stay away from windows and exterior walls",
  "If outdoors, move to open areas",
  "Keep emergency supplies ready",
  "Have a family emergency plan",
];

export const SafetyTips = () => {
  return (
    <Collapsible className="border border-gray-300 rounded-lg shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-gray-700 hover:bg-[#0A4D92]/10">
        <span className="flex items-center">
          <Shield className="mr-2 text-[#0A4D92]" />
          Safety Tips
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        {safetyTips.map((tip, index) => (
          <div key={index} className="mb-3 p-3 bg-[#0A4D92]/5 rounded-lg border border-[#0A4D92]/20">
            <p className="text-gray-700">{tip}</p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
