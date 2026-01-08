"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your BloodLink AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

    const handleSend = () => {
      if (!input.trim()) return;

      const userMsg: Message = { role: "user", content: input };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");

        // Improved mock AI response
        setTimeout(() => {
          const query = input.toLowerCase();
          let response = "I'm here to help with your blood donation questions. You can ask about eligibility, nearby centers, or how to request blood.";
          
          if (query.includes("blood type")) {
            response = "There are 8 main blood types: A+, A-, B+, B-, O+, O-, AB+, and AB-. O- is the universal donor, while AB+ is the universal recipient.";
          } else if (query.includes("request") || query.includes("donation")) {
            response = "To request blood, you can click the 'New Blood Request' button on the dashboard or use the 'Shortage Alerts' page to notify inventory managers. We'll alert nearby donors immediately.";
          } else if (query.includes("donor") || query.includes("matching")) {
            response = "You can find compatible donors in the 'Donor Matching' section. We match donors based on blood type and location proximity. Once matched, you can use the 'Contact' button to reach them.";
          } else if (query.includes("emergency") || query.includes("urgent")) {
            response = "Active emergencies are listed in the 'Emergency Responses' section. When you click 'I Can Donate', the patient is immediately notified with your registered contact number.";
          } else if (query.includes("map") || query.includes("nearby") || query.includes("center") || query.includes("location")) {
            response = "The 'Map Tracking' page shows nearby blood banks and hospitals. Clicking 'Directions' will open the exact location in Google Maps, and the 'Call' button lets you reach them instantly.";
          } else if (query.includes("direction") || query.includes("google maps")) {
            response = "Yes, on both the 'Map Tracking' and 'Donor Matching' pages, you can click the 'Directions' button to open the precise location directly in Google Maps.";
          } else if (query.includes("alert") || query.includes("shortage")) {
            response = "The 'Shortage Alerts' page monitors blood stock levels in real-time. If you see a shortage, you can click 'Request Donation' to alert the entire network of donors.";
          } else if (query.includes("contact") || query.includes("call") || query.includes("phone")) {
            response = "You can contact donors, hospitals, or emergency patients directly through the platform using the 'Contact' or 'Call' buttons. These will initiate a direct phone call from your device.";
          } else if (query.includes("help") || query.includes("how to")) {
            response = "I can guide you through the platform! Try asking about 'how to donate', 'find blood', 'emergency assistance', or 'how directions work'.";
          }
        
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      }, 600);
    };


  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold">BloodLink AI</h3>
            <p className="text-[10px] text-blue-100 uppercase tracking-wider font-bold">Online & Ready to Help</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
          <button 
            onClick={handleSend}
            className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
