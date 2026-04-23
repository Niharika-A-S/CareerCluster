import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { mentors } from '../data/mentors';
import Chat from '../components/Chat';
import Button from '../components/Button';

const ChatPage = () => {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState([]);
  const { addMessage, isAuthenticated, bookings } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Create conversations from booked mentors and messages
    const bookedMentorIds = bookings.map(booking => booking.mentorId);
    const uniqueMentorIds = [...new Set(bookedMentorIds)];
    
    const mentorConversations = uniqueMentorIds.map(mentorId => {
      const mentor = mentors.find(m => m.id === mentorId);
      if (!mentor) return null;
      
      const mentorMessages = messages.filter(msg => 
        msg.mentorId === mentorId || msg.sender === mentor.name
      );
      
      const lastMessage = mentorMessages.length > 0 
        ? mentorMessages[mentorMessages.length - 1]
        : {
            text: "Hi! I'm excited to help you learn. Feel free to ask me anything!",
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            sender: 'mentor'
          };
      
      const aiMessage = {
        id: Date.now(),
        sender: mentor.name,
        content: `Thanks for reaching out! Let me review this and get back to you shortly.`,
        timestamp: new Date().toISOString(),
        isOwn: false
      };
      
      addMessage(aiMessage);
      setIsTyping(false);
      
      return {
        id: mentorId,
        mentor: mentor,
        lastMessage: lastMessage,
        unreadCount: mentorMessages.filter(msg => !msg.isOwn && !msg.read).length
      };
    }).filter(Boolean);

    // Add some default conversations for demo purposes
    if (mentorConversations.length === 0) {
      const defaultMentors = mentors.slice(0, 3);
      const defaultConversations = defaultMentors.map(mentor => ({
        id: mentor.id,
        mentor: mentor,
        lastMessage: {
          text: "Hi! I'm available to help you with your learning journey. Send me a message anytime!",
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          sender: 'mentor'
        },
        unreadCount: 0
      }));
      setConversations(defaultConversations);
    } else {
      setConversations(mentorConversations);
    }
  }, [isAuthenticated, bookings, messages, mentors]);

  const filteredConversations = conversations.filter(conv =>
    conv.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.mentor.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (selectedMentor) {
    return (
      <Chat
        mentor={selectedMentor}
        onClose={() => setSelectedMentor(null)}
      />
    );
  }

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="glass-card border-x-0 border-t-0 rounded-none border-b-white/10 mb-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input px-4 py-2 rounded-lg w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="glass-card h-full">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">All Conversations</h2>
              </div>
              
              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedMentor(conversation.mentor)}
                      className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.mentor.avatar}
                            alt={conversation.mentor.name}
                            className="w-12 h-12 rounded-full border border-white/20"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)] border border-slate-900"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white truncate">
                              {conversation.mentor.name}
                            </p>
                            <span className="text-xs text-white/50">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-white/60 truncate">
                            {conversation.mentor.title}
                          </p>
                          <p className="text-sm text-white/70 truncate mt-1">
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-white/40 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-white/50">No conversations found</p>
                    <p className="text-sm text-white/40 mt-2">
                      Start a conversation with a mentor to see it here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="glass-card h-[600px] flex items-center justify-center border border-white/10">
              <div className="text-center">
                <div className="text-white/40 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-white/60 mb-4">
                  Choose a mentor from the list to start chatting
                </p>
                <Button onClick={() => window.location.href = '/mentors'}>
                  Find Mentors
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
