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
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️', description: 'Cryptocurrency, smart contracts, Web3' }
  ];

  const handleToggleInterest = (interest) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
  };

  const handleSaveInterests = async () => {
    setIsLoading(true);
    const ok = await updateInterests(selectedInterests);
    setIsLoading(false);
    if (ok) navigate('/dashboard');
  };

  useEffect(() => {
    if (interests.length > 0) {
      setSelectedInterests(interests);
    }
  }, [interests]);

  if (!isAuthenticated) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh]">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Please Login First</h2>
          <p className="text-white/70 mb-6">You need to be logged in to select your interests</p>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 mt-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Select Your Learning Interests
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Choose the domains you're interested in learning. We'll use these to find the perfect mentors for you.
          </p>
        </div>

        {/* Interest Selection */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <div
                key={domain.id}
                onClick={() => handleToggleInterest(domain.name)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 group relative overflow-hidden ${
                  selectedInterests.includes(domain.name)
                    ? 'border-indigo-400 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
                    : 'border-white/10 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{domain.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{domain.name}</h3>
                  <p className="text-sm text-white/70">{domain.description}</p>
                </div>
                
                <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestMentorForDomain(domain.name);
                    }}
                    className="shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.8)] neon-border"
                  >
                    Request Mentor
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Interests */}
        {selectedInterests.length > 0 && (
          <div className="glass-card p-6 mb-8 fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">
              Selected Interests ({selectedInterests.length})
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            disabled={selectedInterests.length === 0}
            className="sm:w-auto w-full"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSaveInterests}
            disabled={selectedInterests.length === 0 || isLoading}
            className="sm:w-auto w-full"
          >
            {isLoading ? 'Saving...' : 'Continue to Dashboard'}
          </Button>
        </div>

        {/* Quick Access */}
        <div className="mt-12 text-center pt-8 border-t border-white/10">
          <p className="text-white/70 mb-4">
            Want to explore mentors first?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/mentors')}
          >
            Browse All Mentors
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Interests;
