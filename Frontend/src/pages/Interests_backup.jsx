import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, interests, updateInterests, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleRequestMentorForDomain = (domain) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Filter mentors by domain and navigate to mentors page
    navigate(`/mentors?domain=${encodeURIComponent(domain)}`);
  };

  const domains = [
    { id: 'ai', name: 'Artificial Intelligence', icon: '🤖', description: 'Machine learning, deep learning, neural networks' },
    { id: 'web-dev', name: 'Web Development', icon: '🌐', description: 'Frontend, backend, full-stack development' },
    { id: 'data-science', name: 'Data Science', icon: '📊', description: 'Data analysis, visualization, statistics' },
    { id: 'mobile-dev', name: 'Mobile Development', icon: '📱', description: 'iOS, Android, React Native development' },
    { id: 'cloud-computing', name: 'Cloud Computing', icon: '☁️', description: 'AWS, Azure, Google Cloud, DevOps' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒', description: 'Network security, ethical hacking, cryptography' },
    { id: 'ui-ux', name: 'UI/UX Design', icon: '🎨', description: 'User interface, user experience, design systems' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️', description: 'Cryptocurrency, smart contracts, Web3' },
    { id: 'game-dev', name: 'Game Development', icon: '🎮', description: 'Unity, Unreal Engine, game design' },
    { id: 'devops', name: 'DevOps', icon: '🔧', description: 'CI/CD, containerization, infrastructure' },
    { id: 'database', name: 'Database Management', icon: '🗄️', description: 'SQL, NoSQL, database architecture' },
    { id: 'testing', name: 'Software Testing', icon: '🧪', description: 'QA, automation, performance testing' }
  ];

  useEffect(() => {
    // Load interests from AuthContext
    setSelectedInterests(interests);
  }, [interests]);

  const handleInterestToggle = (domainName) => {
    setSelectedInterests(prev => {
      if (prev.includes(domainName)) {
        return prev.filter(interest => interest !== domainName);
      } else {
        return [...prev, domainName];
      }
    });
  };

  const handleSave = async () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to AuthContext
      updateInterests(selectedInterests);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving interests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Select Your Interests
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the domains you're interested in learning about. This will help us match you with the perfect mentors.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Choose Your Learning Domains
              </h2>
              <span className="text-sm text-gray-500">
                {selectedInterests.length} selected
              </span>
            </div>
            
            {selectedInterests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700 mr-2">Selected:</span>
                {selectedInterests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedInterests.includes(domain.name)
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{domain.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {domain.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {domain.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedInterests.includes(domain.name)
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedInterests.includes(domain.name) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414l4 4a1 1 0 001.414-1.414l2.293-2.293a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Domain Request Button */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRequestMentorForDomain(domain.name)}
                    className="w-full hover:scale-105 transition-transform duration-200"
                  >
                    🎯 Request {domain.name} Mentor
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={isLoading}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || selectedInterests.length === 0}
            className="min-w-[120px]"
          >
            {isLoading ? 'Saving...' : 'Save Interests'}
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            You can always update your interests later from your profile
          </p>
        </div>
      </div>
    </div>
  );
};

export default Interests;
