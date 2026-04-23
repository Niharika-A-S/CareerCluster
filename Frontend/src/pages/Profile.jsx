import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { userAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, interests, updateInterests, isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [userInterests, setUserInterests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    goals: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const domains = [
    'Artificial Intelligence',
    'Web Development', 
    'Data Science',
    'Mobile Development',
    'Cloud Computing',
    'Cybersecurity',
    'DevOps',
    'UI/UX',
    'Blockchain'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setUser(authUser || null);

    const nameParts = (authUser?.name || '').trim().split(' ').filter(Boolean);
    setFormData({
      firstName: authUser?.firstName || nameParts[0] || '',
      lastName: authUser?.lastName || nameParts.slice(1).join(' ') || '',
      email: authUser?.email || '',
      bio: authUser?.profile?.bio || authUser?.bio || '',
      goals: authUser?.profile?.goals || authUser?.goals || ''
    });

    setUserInterests(interests || []);
  }, [navigate, isAuthenticated, authUser, interests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (domain) => {
    setUserInterests(prev => {
      if (prev.includes(domain)) {
        return prev.filter(interest => interest !== domain);
      } else {
        return [...prev, domain];
      }
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      const res = await userAPI.updateProfile({
        name,
        profile: {
          bio: formData.bio,
          goals: formData.goals
        }
      });

      const updatedUser = res.data?.data?.user;
      if (updatedUser) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      await updateInterests(userInterests);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        bio: user.bio || '',
        goals: user.goals || ''
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="w-full flex items-center justify-center min-h-[70vh]">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to view your profile</h2>
          <Button onClick={() => navigate('/login')} className="w-full">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="glass-card border-x-0 border-t-0 rounded-none border-b-white/10 mb-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <div className="flex space-x-3">
              <Link to="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex space-x-3">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />

                <InputField
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    className="glass-input w-full px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={4}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Learning Goals
                  </label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="What do you want to achieve through mentorship?"
                    className="glass-input w-full px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <div className="glass-card p-8 mt-8">
              <h2 className="text-xl font-semibold text-white mb-6">Learning Interests</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {domains.map((domain) => (
                  <label
                    key={domain}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      userInterests.includes(domain)
                        ? 'border-indigo-400 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    } ${!isEditing ? 'opacity-70 cursor-default' : 'hover:-translate-y-0.5'}`}
                  >
                    <input
                      type="checkbox"
                      checked={userInterests.includes(domain)}
                      onChange={() => handleInterestToggle(domain)}
                      disabled={!isEditing}
                      className="w-5 h-5 text-indigo-500 focus:ring-indigo-400 border-white/20 bg-white/10 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-white/90">
                      {domain}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Stats Card */}
            <div className="glass-card p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-white/70 text-sm">Mentorship Sessions</span>
                  <span className="text-2xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">0</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-white/70 text-sm">Active Mentors</span>
                  <span className="text-2xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">0</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-white/70 text-sm">Learning Hours</span>
                  <span className="text-2xl font-bold text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]">0</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/mentors" className="block">
                  <Button className="w-full" variant="outline">
                    Find Mentors
                  </Button>
                </Link>
                <Link to="/interests" className="block">
                  <Button className="w-full" variant="outline">
                    Update Interests
                  </Button>
                </Link>
                <Button 
                  className="w-full mt-4" 
                  variant="danger"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
