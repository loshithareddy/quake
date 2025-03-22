
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
    <Collapsible className="border border-gray-300 rounded-lg bg-white shadow-sm">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-gray-700 hover:bg-gray-100">
        <span className="flex items-center">
          <Phone className="mr-2" />
          Emergency Contacts
        </span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-gray-700 mb-2">Add Custom Contact</h3>
          <input
            type="text"
            placeholder="Contact Name"
            value={newContact.name}
            onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
            className="w-full mb-2 p-2 bg-white border border-gray-300 rounded text-gray-700"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newContact.number}
            onChange={(e) => setNewContact(prev => ({ ...prev, number: e.target.value }))}
            className="w-full mb-2 p-2 bg-white border border-gray-300 rounded text-gray-700"
          />
          <button
            onClick={handleAddContact}
            className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Add Contact
          </button>
        </div>
        {customContacts.map((contact, index) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-700">{contact.name}</div>
            <div className="text-gray-500">{contact.number}</div>
          </div>
        ))}
        {emergencyContacts.map((contact) => (
          <div key={contact.name} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-semibold text-gray-700">{contact.name}</div>
            <div className="text-gray-500">{contact.number}</div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
