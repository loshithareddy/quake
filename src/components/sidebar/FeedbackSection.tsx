import { ChevronDown, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

export const FeedbackSection = () => {
  const { toast } = useToast();

  return (
    <Collapsible className="border border-mint/20 rounded-lg">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
        <span className="flex items-center">
          <MessageSquare className="mr-2" />
          Feedback
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="p-3 bg-forest rounded-lg border border-mint/20">
          <textarea
            placeholder="Share your feedback or report an earthquake..."
            className="w-full h-24 p-2 mb-2 bg-transparent border border-mint/20 rounded text-white resize-none"
          />
          <button
            onClick={() => toast({
              title: "Thank you!",
              description: "Your feedback has been submitted.",
            })}
            className="w-full p-2 bg-mint text-forest rounded hover:bg-mint/90"
          >
            Submit Feedback
          </button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};