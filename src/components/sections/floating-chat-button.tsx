"use client"

import { useState } from 'react'
import { Bot, X, Send } from 'lucide-react'

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: 'Hello! I\'m BloodLink AI assistant. I can help you with:\n\n• Blood donation eligibility\n• Finding nearby blood banks\n• Emergency blood requests\n• Donation scheduling\n\nHow can I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    setTimeout(() => {
      const responses: Record<string, string> = {
        'eligibility': 'To donate blood, you must be:\n• At least 18 years old\n• Weigh at least 50 kg\n• Be in good health\n• Have hemoglobin level ≥ 12.5 g/dL\n\nYou can check your full eligibility using our Health Eligibility Checker!',
        'blood type': 'Blood type compatibility:\n• O- is the universal donor\n• AB+ is the universal recipient\n• Same type donations are always safe\n\nNot sure of your type? Any blood bank can test you for free!',
        'emergency': 'For emergencies:\n1. Use our Emergency SOS feature\n2. Call the nearest blood bank\n3. We\'ll notify compatible donors nearby\n\nEvery second counts - submit your request now!',
        'donate': 'Ready to donate? Here\'s how:\n1. Check your eligibility\n2. Find a nearby blood bank\n3. Schedule an appointment\n4. Complete donation (takes ~15 mins)\n5. Get your certificate!\n\nYour donation can save up to 3 lives!',
      }

      let response = 'I understand you\'re asking about blood donation. Could you be more specific? I can help with eligibility, blood types, emergencies, or the donation process.'
      
      const lowerMessage = userMessage.toLowerCase()
      for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
          response = value
          break
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">BloodLink AI</h3>
                <p className="text-xs text-white/70">Your donation assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-slate-800 text-slate-200'
                }`}>
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about blood donation..."
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-red-500 outline-none text-sm"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 z-50 flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? <X className="h-7 w-7 text-white" /> : <Bot className="h-7 w-7 text-white" />}
      </button>
    </>
  )
}
