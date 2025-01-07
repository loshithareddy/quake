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
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <Shield className="mr-2" />
          Safety Tips
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        {safetyTips.map((tip, index) => (
          <div key={index} className="mb-3 p-3 bg-forest rounded-lg border border-mint/20">
            <p className="text-white/80">{tip}</p>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};