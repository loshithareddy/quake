
import { useState } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

export const EmergencyContacts = () => {
  const [customContacts, setCustomContacts] = useState<Array<{name: string; number: string}>>(() => {
    const saved = localStorage.getItem('emergencyContacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [newContact, setNewContact] = useState({ name: '', number: '' });
  const { toast } = useToast();

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

  return (
    <Collapsible className="border border-[#2D3748] rounded-lg bg-[#1A1F2C]">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-indigo-300 hover:bg-[#222935]">
        <span className="flex items-center">
          <Phone className="mr-2" />
          Emergency Contacts
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="mb-4 p-3 bg-[#222935] rounded-lg border border-[#2D3748]">
          <h3 className="text-indigo-300 mb-2">Add Custom Contact</h3>
          <input
            type="text"
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
            className="w-full mb-2 p-2 bg-[#1A1F2C] border border-[#2D3748] rounded text-white"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newContact.number}
            onChange={(e) => setNewContact(prev => ({ ...prev, number: e.target.value }))}
            className="w-full mb-2 p-2 bg-[#1A1F2C] border border-[#2D3748] rounded text-white"
          />
          <button
            onClick={handleAddContact}
            className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add Contact
          </button>
        </div>
        {customContacts.map((contact, index) => (
          <div key={index} className="mb-3 p-3 bg-[#222935] rounded-lg border border-[#2D3748]">
            <div className="font-semibold text-indigo-300">{contact.name}</div>
            <div className="text-gray-300">{contact.number}</div>
          </div>
        ))}
        {emergencyContacts.map((contact) => (
          <div key={contact.name} className="mb-3 p-3 bg-[#222935] rounded-lg border border-[#2D3748]">
            <div className="font-semibold text-indigo-300">{contact.name}</div>
            <div className="text-gray-300">{contact.number}</div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
