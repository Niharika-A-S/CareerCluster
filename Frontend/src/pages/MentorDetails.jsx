import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Chat from '../components/Chat';
import { mentors } from '../data/mentors';

const MentorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const foundMentor = mentors.find(m => m.id === parseInt(id));
    if (foundMentor) {
      setMentor(foundMentor);
    }
    setLoading(false);
  }, [id]);

  const handleRequestMentorship = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    setShowBookingForm(true);
  };

  const handleStartChat = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
    setShowChat(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the booking request to your API
    alert('Mentorship request sent successfully! The mentor will contact you soon.');
    setShowBookingForm(false);
    setBookingMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Mentor not found</h2>
          <Button onClick={() => navigate('/mentors')}>Back to Mentors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="glass-card border-x-0 border-t-0 rounded-none border-b-white/10 mb-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/mentors')}
            className="mb-4 text-white/80 border-white/20 hover:bg-white/10"
          >
            ← Back to Mentors
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Mentor Profile Card */}
            <div className="glass-card mb-8">
              <div className="p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={mentor.avatar}
                    alt={mentor.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-indigo-400/50 shadow-lg"
                  />
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">{mentor.name}</h1>
                    <p className="text-xl text-white/80 mb-1">{mentor.title}</p>
                    <p className="text-white/60 mb-4">{mentor.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-semibold text-white">{mentor.rating}</span>&nbsp;rating
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-white/50 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span><span className="text-white font-medium">{mentor.sessions}</span> sessions</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-white/50 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                        </svg>
                        <span><span className="text-white font-medium">{mentor.experience}</span> experience</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                  <p className="text-white/80 leading-relaxed">{mentor.bio}</p>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Education</h2>
                  <p className="text-white/80">{mentor.education}</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {mentor.expertise.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Request Mentorship</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-white/80">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Available {mentor.availability.toLowerCase()}
                </div>
                <div className="flex items-center text-sm text-white/80">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  {mentor.domains.join(', ')}
                </div>
              </div>

              {!showBookingForm ? (
                <div className="space-y-3">
                  <Button 
                    onClick={handleRequestMentorship}
                    className="w-full shadow-lg"
                    size="lg"
                  >
                    📅 Book a Session
                  </Button>
                  <Button 
                    onClick={handleStartChat}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    💬 Start Chat
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      Your Message
                    </label>
                    <textarea
                      value={bookingMessage}
                      onChange={(e) => setBookingMessage(e.target.value)}
                      placeholder="Tell the mentor about your learning goals..."
                      className="glass-input w-full px-3 py-2 rounded-lg"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button type="submit" className="flex-1">
                      Send Request
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 text-center">
                  By requesting mentorship, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && mentor && (
        <Chat
          mentor={mentor}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default MentorDetails;
