// Chat service for handling mentor-student conversations

// Mock conversation data
const mockConversations = [
  {
    id: 1,
    mentorId: 1,
    studentId: 'student1',
    messages: [
      {
        id: 1,
        sender: 'mentor',
        text: 'Hi! I\'m Dr. Sarah Johnson. How can I help you with your AI learning journey?',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 2,
        sender: 'student',
        text: 'Hi! I\'m interested in learning about machine learning fundamentals.',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 3,
        sender: 'mentor',
        text: 'That\'s great! Machine learning is a fascinating field. I\'d recommend starting with linear algebra and statistics basics. Have you studied those?',
        timestamp: new Date(Date.now() - 900000).toISOString()
      }
    ],
    lastMessage: {
      text: 'That\'s great! Machine learning is a fascinating field. I\'d recommend starting with linear algebra and statistics basics. Have you studied those?',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      sender: 'mentor'
    },
    unreadCount: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    mentorId: 2,
    studentId: 'student1',
    messages: [
      {
        id: 1,
        sender: 'student',
        text: 'Hello! I saw your profile and I\'m impressed with your React experience.',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 2,
        sender: 'mentor',
        text: 'Thank you! I\'d be happy to help you with React development. What specific topics are you interested in?',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    lastMessage: {
      text: 'Thank you! I\'d be happy to help you with React development. What specific topics are you interested in?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      sender: 'mentor'
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

// Chat service functions
export const chatService = {
  // Get all conversations for a student
  getConversations: async (studentId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockConversations.filter(conv => conv.studentId === studentId);
  },

  // Get conversation by ID
  getConversationById: async (conversationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockConversations.find(conv => conv.id === conversationId);
  },

  // Get conversation between student and mentor
  getConversationByMentor: async (studentId, mentorId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockConversations.find(conv => 
      conv.studentId === studentId && conv.mentorId === mentorId
    );
  },

  // Send a message
  sendMessage: async (conversationId, message) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    if (conversation) {
      const newMessage = {
        id: conversation.messages.length + 1,
        sender: message.sender,
        text: message.text,
        timestamp: new Date().toISOString()
      };
      
      conversation.messages.push(newMessage);
      conversation.lastMessage = newMessage;
      
      // Simulate mentor response
      if (message.sender === 'student') {
        setTimeout(() => {
          const mentorResponse = {
            id: conversation.messages.length + 1,
            sender: 'mentor',
            text: generateMentorResponse(message.text),
            timestamp: new Date().toISOString()
          };
          conversation.messages.push(mentorResponse);
          conversation.lastMessage = mentorResponse;
        }, 1500);
      }
      
      return newMessage;
    }
    throw new Error('Conversation not found');
  },

  // Create new conversation
  createConversation: async (studentId, mentorId, initialMessage) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newConversation = {
      id: mockConversations.length + 1,
      mentorId,
      studentId,
      messages: [
        {
          id: 1,
          sender: 'student',
          text: initialMessage,
          timestamp: new Date().toISOString()
        }
      ],
      lastMessage: {
        text: initialMessage,
        timestamp: new Date().toISOString(),
        sender: 'student'
      },
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };
    
    mockConversations.push(newConversation);
    
    // Simulate mentor response
    setTimeout(() => {
      const mentorResponse = {
        id: 2,
        sender: 'mentor',
        text: 'Thanks for reaching out! I\'ll get back to you soon with a response.',
        timestamp: new Date().toISOString()
      };
      newConversation.messages.push(mentorResponse);
      newConversation.lastMessage = mentorResponse;
      newConversation.unreadCount = 1;
    }, 2000);
    
    return newConversation;
  },

  // Mark messages as read
  markAsRead: async (conversationId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const conversation = mockConversations.find(conv => conv.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      return true;
    }
    return false;
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockConversations.findIndex(conv => conv.id === conversationId);
    if (index !== -1) {
      mockConversations.splice(index, 1);
      return true;
    }
    return false;
  }
};

// Helper function to generate mentor responses
function generateMentorResponse(userMessage) {
  const responses = [
    "That's a great question! Based on my experience, I'd recommend starting with the fundamentals first.",
    "I've worked with many students on similar topics. Let me share some insights that might help you.",
    "Excellent point! This is actually something I'm very passionate about. Here's what I suggest...",
    "I'd be happy to guide you through this. Would you like to schedule a session to discuss it in detail?",
    "That's a common challenge. Here's a strategy that has worked well for others in your situation.",
    "Great observation! Have you considered looking into this from a different perspective?",
    "I understand your concern. Let me break this down into manageable steps for you.",
    "That's exactly the right approach. You're on the right track with your thinking.",
    "I'd love to help you with that. What specific aspect would you like to explore first?",
    "That's a thoughtful question. The answer depends on your specific goals and background."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export default chatService;
