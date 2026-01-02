"use client";

import React, { useState } from "react";
import { Bot } from "lucide-react";
import ChatBot from "./ChatBot";

const ChatBotTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full flex items-center justify-center p-0 transition-all duration-200 ease-in-out cursor-pointer z-50 animate-bounce bg-gradient-to-r from-[#2563EB] to-[#9333EA] hover:from-[#1D4ED8] hover:to-[#7E22CE] border-none outline-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ring-offset-background group"
        aria-label="Open AI Assistant"
      >
        <Bot 
          className="h-8 w-8 text-white transition-transform group-hover:scale-110" 
          strokeWidth={2}
        />
      </button>
      <ChatBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default ChatBotTrigger;
