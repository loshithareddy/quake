
import { ChevronDown, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

export const FeedbackSection = () => {
  const { toast } = useToast();

  return (
    <Collapsible className="border border-gray-300 rounded-lg shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-gray-700 hover:bg-gray-100">
        <span className="flex items-center">
          <MessageSquare className="mr-2" />
          Feedback
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <textarea
            placeholder="Share your feedback or report an earthquake..."
            className="w-full h-24 p-2 mb-2 bg-white border border-gray-300 rounded text-gray-700 resize-none"
          />
          <button
            onClick={() => toast({
              title: "Thank you!",
              description: "Your feedback has been submitted.",
            })}
            className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Submit Feedback
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
