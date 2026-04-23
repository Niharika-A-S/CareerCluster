import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mentors } from '../data/mentors';
import MentorCard from './MentorCard';
import Button from './Button';

/**
 * AI Recommendations component that suggests mentors based on user behavior and interests
 */
const AIRecommendations = () => {
  const { user, interests, bookings, messages, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    // Simulate AI processing
    setTimeout(() => {
      const aiRecommendations = generateAIRecommendations();
      setRecommendations(aiRecommendations);
      setIsLoading(false);
    }, 1500);
  }, [isAuthenticated, interests, bookings, messages]);

  const generateAIRecommendations = () => {
    if (interests.length === 0) {
      // If no interests, recommend popular mentors
      return mentors
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map(mentor => ({
          ...mentor,
          aiScore: 85 + Math.floor(Math.random() * 15),
          reasoning: "Highly rated mentor with excellent student feedback",
          matchFactors: ["Top rated", "Popular choice", "Great communication"]
        }));
    }

    // AI scoring algorithm
    const scoredMentors = mentors.map(mentor => {
      let score = 0;
      const factors = [];
      let reasoning = "";

      // Interest matching (40% weight)
      const interestMatch = mentor.domains.filter(domain => interests.includes(domain)).length;
      if (interestMatch > 0) {
        score += (interestMatch / interests.length) * 40;
        factors.push(`${interestMatch} interest(s) match`);
        reasoning += `Strong alignment with your interests in ${mentor.domains.filter(d => interests.includes(d)).join(', ')}. `;
      }

      // Rating bonus (20% weight)
      if (mentor.rating >= 4.5) {
        score += 20;
        factors.push("Top rated");
        reasoning += "Exceptionally high student satisfaction. ";
      } else if (mentor.rating >= 4.0) {
        score += 15;
        factors.push("Well rated");
        reasoning += "Consistently positive feedback. ";
      }

      // Experience bonus (15% weight)
      const expYears = parseInt(mentor.experience) || 0;
      if (expYears >= 10) {
        score += 15;
        factors.push("Experienced");
        reasoning += "Extensive industry experience. ";
      } else if (expYears >= 5) {
        score += 10;
        factors.push("Good experience");
        reasoning += "Solid professional background. ";
      }

      // Session activity bonus (15% weight)
      if (mentor.sessions >= 100) {
        score += 15;
        factors.push("Active mentor");
        reasoning += "Highly engaged with students. ";
      } else if (mentor.sessions >= 50) {
        score += 10;
        factors.push("Experienced mentor");
        reasoning += "Proven track record. ";
      }

      // Availability bonus (10% weight)
      if (mentor.availability.toLowerCase().includes('available')) {
        score += 10;
        factors.push("Available");
        reasoning += "Currently accepting new students. ";
      }

      // Behavioral analysis (bonus points)
      const userBookings = bookings.length;
      const userMessages = messages.length;
      
      if (userBookings > 0) {
        // User has booked before - recommend similar domains
        const bookedDomains = [...new Set(bookings.map(b => b.domain))];
        const domainMatch = mentor.domains.filter(domain => bookedDomains.includes(domain)).length;
        if (domainMatch > 0) {
          score += 5;
          factors.push("Similar to your bookings");
          reasoning += "Matches your previous learning patterns. ";
        }
      }

      if (userMessages > 0) {
        // User is active - recommend responsive mentors
        score += 3;
        factors.push("Good communicator");
        reasoning += "Known for excellent communication. ";
      }

      return {
        ...mentor,
        aiScore: Math.min(100, Math.round(score)),
        reasoning: reasoning || "Matches your learning profile based on multiple factors.",
        matchFactors: factors.length > 0 ? factors : ["Recommended for you"]
      };
    });

    // Sort by AI score and return top recommendations
    return scoredMentors
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Potential Match';
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Recommendations</h3>
        <p className="text-gray-600 mb-4">
          Sign up to get personalized mentor recommendations based on your interests and learning goals
        </p>
        <Button>Sign Up Free</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analyzing Your Profile...</h3>
        <p className="text-gray-600 text-sm">
          Our AI is analyzing your interests and learning patterns to find the perfect mentors for you
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Personalized mentor matches for you</p>
          </div>
        </div>
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          {showReasoning ? 'Hide' : 'Show'} Reasoning
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((mentor, index) => (
          <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{mentor.name}</h4>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getScoreColor(mentor.aiScore)}`}>
                      {mentor.aiScore}%
                    </div>
                    <div className={`text-xs ${getScoreColor(mentor.aiScore)}`}>
                      {getScoreLabel(mentor.aiScore)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {mentor.matchFactors.map((factor, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {factor}
                    </span>
                  ))}
                </div>

                {showReasoning && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    <strong>Why recommended:</strong> {mentor.reasoning}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {mentor.rating}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {mentor.sessions} sessions
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>How it works:</strong> Our AI analyzes your interests, learning patterns, and behavior to recommend mentors who are most likely to help you achieve your goals. Recommendations update as you interact with the platform.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
