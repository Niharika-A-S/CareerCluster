import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import BookingModal from './BookingModal';

const MentorCard = ({ mentor }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { addBooking, isAuthenticated } = useAuth();

  const handleBooking = (bookingData) => {
    addBooking(bookingData);
  };

  const handleRequestMentorship = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Please log in to book a session');
      return;
    }
    
    setIsBookingModalOpen(true);
  };

  return (
    <>
      <div className="glass-card overflow-hidden card-hover fade-in hover-lift neon-border relative group">
        <div className="p-6 relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-16 h-16 rounded-full object-cover border border-white/20"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{mentor.name}</h3>
              <p className="text-sm text-white/70">{mentor.title}</p>
              <p className="text-xs text-white/50">{mentor.company}</p>
            </div>
          </div>

          <p className="text-white/80 text-sm mb-4 line-clamp-2">{mentor.bio}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.expertise.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {mentor.expertise.length > 3 && (
              <span className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full">
                +{mentor.expertise.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-white/70 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{mentor.rating}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-white/50 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span>{mentor.sessions} sessions</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60">
              {mentor.experience} experience
            </span>
            <div className="flex space-x-2">
              <Link to={`/mentor/${mentor.id}`}>
                <Button size="sm" variant="outline" className="hover:bg-white/10 transition-colors">View Profile</Button>
              </Link>
              <Button 
                size="sm" 
                onClick={handleRequestMentorship}
                className="hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] neon-border"
              >
                Request Mentorship
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        mentor={mentor}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleBooking}
      />
    </>
  );
};

export default MentorCard;
