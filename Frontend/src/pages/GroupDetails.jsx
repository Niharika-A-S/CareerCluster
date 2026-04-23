import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { groupAPI } from '../services/api';

const mockMembers = [
  { id: 'm1', name: 'Sarah Drasner', role: 'Mentor', isOnline: true },
  { id: 'm2', name: 'John Doe', role: 'Mentor', isOnline: false },
  { id: 's1', name: 'Alice Smith', role: 'Student', isOnline: true },
  { id: 's2', name: 'Bob Johnson', role: 'Student', isOnline: true },
  { id: 's3', name: 'Charlie Davis', role: 'Student', isOnline: false },
  { id: 's4', name: 'Diana Prince', role: 'Student', isOnline: true }
];

const initialMessages = [
  { id: 1, sender: 'Sarah Drasner', text: 'Welcome to the group everyone! Excited to get started.', time: '10:00 AM', isOwn: false, role: 'Mentor' },
  { id: 2, sender: 'Alice Smith', text: 'Hi Sarah! Thanks for having us.', time: '10:05 AM', isOwn: false, role: 'Student' },
  { id: 3, sender: 'Bob Johnson', text: 'Looking forward to learning from you all.', time: '10:15 AM', isOwn: false, role: 'Student' }
];

const GroupDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await groupAPI.getGroupById(id);
        setGroup(res.data?.data?.group || null);
      } catch (e) {
        console.error(e);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.firstName || user?.name || 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      role: 'Student' // Assuming logged in user is a student for this demo
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate someone typing a reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'Sarah Drasner',
        text: 'That sounds great! Let us explore that idea.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        role: 'Mentor'
      }]);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh]">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Loading group...</h2>
          <p className="text-white/60">Please wait</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh]">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Group Not Found</h2>
          <Link to="/groups">
            <Button>Back to Groups</Button>
          </Link>
        </div>
      </div>
    );
  }

  const members = Array.isArray(group.members) ? group.members : [];
  const memberCount = members.length;

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col pt-4 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-card mb-4 p-4 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white">{group.groupName || group.name}</h1>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-medium hidden sm:inline-block">
              {group.interest || group.domain}
            </span>
          </div>
          <p className="text-white/50 text-sm mt-1">{memberCount} Members</p>
        </div>
        <Link to="/groups">
          <Button variant="outline" size="sm">Back</Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden gap-4 flex-col lg:flex-row">
        
        {/* Left Sidebar: Members */}
        <div className="glass-card w-full lg:w-64 xl:w-80 flex flex-col shrink-0 lg:h-full h-48">
          <div className="p-4 border-b border-white/10 shrink-0">
            <h2 className="text-lg font-semibold text-white">Members</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {members.map((m) => {
              const member = m.user || m;
              const role = (m.roleInGroup || member.role || '').toString();
              const roleLabel = role === 'mentor' ? 'Mentor' : 'Student';
              return (
              <div key={member._id || member.id} className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center">
                    <span className="text-white font-medium">{(member.name || 'U')[0]}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{member.name}</p>
                  <p className={`text-xs ${roleLabel === 'Mentor' ? 'text-indigo-400' : 'text-blue-300'}`}>
                    {roleLabel}
                  </p>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Right Area: Chat */}
        <div className="glass-card flex-1 flex flex-col overflow-hidden min-h-[400px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-slate-900/20">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                {!msg.isOwn && (
                  <div className="flex items-center space-x-2 mb-1 pl-1">
                    <span className="text-sm font-medium text-white/90">{msg.sender}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      msg.role === 'Mentor' 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {msg.role}
                    </span>
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 ${
                  msg.isOwn
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm shadow-[0_5px_15px_rgba(99,102,241,0.4)]'
                    : 'bg-white/10 text-white border border-white/5 rounded-tl-sm backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.2)] hover:bg-white/15'
                }`}>
                  <p className="text-sm md:text-base whitespace-pre-wrap break-words">{msg.text}</p>
                </div>
                
                <span className={`text-xs mt-1 ${msg.isOwn ? 'text-indigo-300 pr-1' : 'text-white/40 pl-1'}`}>
                  {msg.time}
                </span>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start fade-in">
                <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 flex space-x-1.5 backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
                  <div className="w-2 h-2 bg-white/60 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-slate-900/60 backdrop-blur-xl border-t border-white/10 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="glass-input flex-1 px-4 py-3 rounded-xl focus:ring-indigo-500"
              />
              <Button type="submit" disabled={!newMessage.trim()} className="rounded-xl px-5 py-3 h-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupDetails;
