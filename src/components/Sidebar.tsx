import { format } from "date-fns";
import type { Earthquake } from "@/lib/types";
import { ChevronDown, Clock, History, Info, Phone, Shield, AlertTriangle, MessageSquare } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import SeismicGraph from "./SeismicGraph";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  earthquakes?: Earthquake[];
}

const Sidebar = ({ earthquakes }: SidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [customContacts, setCustomContacts] = useState<Array<{name: string; number: string}>>(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newContact, setNewContact] = useState({ name: '', number: '' });
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.number) return;
    const updatedContacts = [...customContacts, newContact];
    setCustomContacts(updatedContacts);
    localStorage.setItem('emergencyContacts', JSON.stringify(updatedContacts));
    setNewContact({ name: '', number: '' });
    toast({
      title: "Contact Added",
      description: "Emergency contact has been saved",
    });
  };

  const emergencyContacts = [
    { name: "National Emergency Number", number: "112" },
    { name: "Police", number: "100" },
    { name: "Fire", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Disaster Management", number: "108" },
  ];

  const safetyTips = [
    "Drop, Cover, and Hold On during shaking",
    "Stay away from windows and exterior walls",
    "If outdoors, move to open areas",
    "Keep emergency supplies ready",
    "Have a family emergency plan",
  ];

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
        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <AlertTriangle className="mr-2" />
              Recent Earthquakes & Activity
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-3">
            <SeismicGraph earthquakes={earthquakes} />
            {earthquakes?.map((eq) => (
              <div key={eq.id} className="p-3 rounded-lg bg-forest border border-mint/20">
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
          </CollapsibleContent>
        </Collapsible>

        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <Phone className="mr-2" />
              Emergency Contacts
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="mb-4 p-3 bg-forest rounded-lg border border-mint/20">
              <h3 className="text-mint mb-2">Add Custom Contact</h3>
              <input
                type="text"
                placeholder="Contact Name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mb-2 p-2 bg-transparent border border-mint/20 rounded text-white"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={newContact.number}
                onChange={(e) => setNewContact(prev => ({ ...prev, number: e.target.value }))}
                className="w-full mb-2 p-2 bg-transparent border border-mint/20 rounded text-white"
              />
              <button
                onClick={handleAddContact}
                className="w-full p-2 bg-mint text-forest rounded hover:bg-mint/90"
              >
                Add Contact
              </button>
            </div>
            {customContacts.map((contact, index) => (
              <div key={index} className="mb-3 p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">{contact.name}</div>
                <div className="text-white/80">{contact.number}</div>
              </div>
            ))}
            {emergencyContacts.map((contact) => (
              <div key={contact.name} className="mb-3 p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">{contact.name}</div>
                <div className="text-white/80">{contact.number}</div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

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

        <Collapsible className="border border-mint/20 rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-mint hover:bg-forest/50">
            <span className="flex items-center">
              <History className="mr-2" />
              Historical Events
            </span>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            <div className="space-y-3">
              <div className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">2001 Gujarat Earthquake</div>
                <p className="text-white/80">Magnitude 7.7 - One of India's most devastating earthquakes</p>
              </div>
              <div className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">2004 Indian Ocean Earthquake</div>
                <p className="text-white/80">Magnitude 9.1 - Triggered devastating tsunamis</p>
              </div>
              <div className="p-3 bg-forest rounded-lg border border-mint/20">
                <div className="font-semibold text-mint">2015 Nepal Earthquake</div>
                <p className="text-white/80">Magnitude 7.8 - Affected parts of North India</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
};

export default Sidebar;