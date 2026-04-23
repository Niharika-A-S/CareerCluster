import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import InputField from './InputField';

const Chat = ({ mentor, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { addMessage, user } = useAuth();

  useEffect(() => {
    // Load existing messages from AuthContext or create initial messages
    const existingMessages = JSON.parse(localStorage.getItem(`chat_${mentor.id}`) || '[]');
    
    if (existingMessages.length === 0) {
      const initialMessages = [
        {
          id: Date.now().toString(),
          sender: mentor.name,
          text: `Hi! I'm ${mentor.name}. I'm excited to help you learn ${mentor.expertise[0]}! How can I assist you today?`,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isOwn: false,
          mentorId: mentor.id
        }
      ];
      setMessages(initialMessages);
    } else {
      setMessages(existingMessages);
    }
  }, [mentor]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true,
      mentorId: mentor.id
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Save to AuthContext and localStorage
    addMessage(userMessage);
    const updatedMessages = [...messages, userMessage];
    localStorage.setItem(`chat_${mentor.id}`, JSON.stringify(updatedMessages));

    // Simulate mentor response with typing indicator
    setTimeout(() => {
      setIsTyping(false);
      const mentorResponse = {
        id: (Date.now() + 1).toString(),
        sender: mentor.name,
        text: generateMentorResponse(newMessage),
        timestamp: new Date().toISOString(),
        isOwn: false,
        mentorId: mentor.id
      };
      
      setMessages(prev => [...prev, mentorResponse]);
      addMessage(mentorResponse);
      
      const finalMessages = [...updatedMessages, mentorResponse];
      localStorage.setItem(`chat_${mentor.id}`, JSON.stringify(finalMessages));
    }, 1500 + Math.random() * 1000); // Random delay for realism
  };

  const generateMentorResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Great to connect with you. What specific topic would you like to discuss today?";
    }
    
    if (message.includes('help') || message.includes('assist')) {
      return "I'm here to help! Based on my experience, I can guide you through various topics. What area would you like to focus on?";
    }
    
    if (message.includes('experience') || message.includes('background')) {
      return `I have ${mentor.experience} of experience in ${mentor.expertise.join(', ')}. I've worked with over ${mentor.sessions} students and helped them achieve their learning goals.`;
    }
    
    if (message.includes('schedule') || message.includes('session') || message.includes('meeting')) {
      return "I'd love to schedule a session with you! You can click the 'Request Mentorship' button on my profile to book a time that works for you.";
    }
    
    if (message.includes('thank')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know?";
    }
    
    if (message.includes('question')) {
      return "Please feel free to ask any questions! That's what I'm here for. No question is too basic or advanced.";
    }
    
    // Default intelligent responses
    const responses = [
      "That's a great question! Based on my experience, I'd recommend starting with the fundamentals and building up gradually.",
      "I've worked with many students on similar topics. Let me share some insights that have worked well for others.",
      "Excellent point! This is actually something I'm very passionate about. Here's what I suggest...",
      "I'd be happy to guide you through this. Would you like to schedule a session to discuss it in detail?",
      "That's a common challenge. Here's a strategy that has worked well for others in your situation.",
      "Great question! Let me break this down into manageable steps for you.",
      "I appreciate you asking about this. It shows you're really thinking about your learning journey."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-2xl h-[600px] flex flex-col overflow-hidden shadow-2xl border border-white/20">
        {/* Header */}
        <div className="bg-slate-900/60 border-b border-white/10 text-white p-4 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <h3 className="font-semibold text-white">{mentor.name}</h3>
              <p className="text-sm text-white/70">{mentor.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
            <span className="text-sm text-white/90">Online</span>
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10 ml-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                message.isOwn
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_5px_15px_rgba(99,102,241,0.4)] rounded-tr-sm'
                  : 'bg-white/10 text-white border border-white/5 rounded-tl-sm backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-white/15'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isOwn ? 'text-indigo-200' : 'text-white/50'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start fade-in">
              <div className="bg-white/10 text-white px-4 py-3 rounded-2xl rounded-tl-sm border border-white/5 backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2 h-2 bg-white/60 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-white/10 p-4 bg-slate-900/40 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="glass-input flex-1 px-4 py-2 rounded-xl"
              disabled={isTyping}
            />
            <Button type="submit" disabled={isTyping || !newMessage.trim()} className="rounded-xl px-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </form>
          
          {isTyping && (
            <div className="text-xs text-white/50 mt-2 pl-1">
              {mentor.name} is typing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
