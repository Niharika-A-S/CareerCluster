import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MentorCard from '../components/MentorCard';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { mentors } from '../data/mentors';
import { 
  filterMentorsByInterests, 
  sortMentorsByRelevance, 
  getMentorsByDomain,
  searchMentors 
} from '../utils/mentorFilter';

const Mentors = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [filteredMentors, setFilteredMentors] = useState(mentors);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { interests, isAuthenticated } = useAuth();

  // Get domain from URL parameter
  useEffect(() => {
    const domainParam = searchParams.get('domain');
    if (domainParam) {
      setSelectedDomain(domainParam);
    }
  }, [searchParams]);

  const domains = ['all', 'AI', 'Web Development', 'Data Science', 'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'DevOps', 'UI/UX', 'Blockchain'];
const experienceLevels = ['all', 'Junior (0-2 years)', 'Mid (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)'];
const availabilityOptions = ['all', 'Available', 'Busy', 'Weekends', 'Weekdays'];
const ratingOptions = ['all', '4.5+', '4.0+', '3.5+', '3.0+'];

  useEffect(() => {
    let filtered = mentors;

    // Apply interest-based filtering if user has interests and no manual filters are set
    if (interests.length > 0 && !searchTerm && selectedDomain === 'all' && 
        selectedExperience === 'all' && selectedAvailability === 'all' && 
        selectedRating === 'all' && sortBy === 'rating') {
      const interestFilter = filterMentorsByInterests(mentors, interests);
      filtered = sortMentorsByRelevance(interestFilter.filteredMentors, interests);
    } else {
      // Apply manual filters
      if (searchTerm) {
        filtered = searchMentors(filtered, searchTerm);
      }

      // Filter by domain
      if (selectedDomain !== 'all') {
        filtered = getMentorsByDomain(filtered, selectedDomain);
      }

      // Filter by experience level
      if (selectedExperience !== 'all') {
        filtered = filtered.filter(mentor => {
          const exp = parseInt(mentor.experience) || 0;
          switch (selectedExperience) {
            case 'Junior (0-2 years)':
              return exp >= 0 && exp <= 2;
            case 'Mid (3-5 years)':
              return exp >= 3 && exp <= 5;
            case 'Senior (6-10 years)':
              return exp >= 6 && exp <= 10;
            case 'Expert (10+ years)':
              return exp > 10;
            default:
              return true;
          }
        });
      }

      // Filter by availability
      if (selectedAvailability !== 'all') {
        filtered = filtered.filter(mentor => 
          mentor.availability.toLowerCase().includes(selectedAvailability.toLowerCase())
        );
      }

      // Filter by rating
      if (selectedRating !== 'all') {
        const minRating = parseFloat(selectedRating.replace('+', ''));
        filtered = filtered.filter(mentor => mentor.rating >= minRating);
      }

      // Sort
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'sessions':
            return b.sessions - a.sessions;
          case 'experience':
            const expA = parseInt(a.experience) || 0;
            const expB = parseInt(b.experience) || 0;
            return expB - expA;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'relevance':
            return (b.relevanceScore || 0) - (a.relevanceScore || 0);
          default:
            return 0;
        }
      });
    }

    setFilteredMentors(filtered);
  }, [searchTerm, selectedDomain, selectedExperience, selectedAvailability, selectedRating, sortBy, interests]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDomain('all');
    setSelectedExperience('all');
    setSelectedAvailability('all');
    setSelectedRating('all');
    setSortBy('rating');
  };

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="glass-card border-x-0 border-t-0 rounded-none border-b-white/10 mb-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Find Your Mentor</h1>
              <p className="text-white/70 mt-1">
                {interests.length > 0 && !searchTerm && selectedDomain === 'all' && sortBy === 'rating' 
                  ? filterMentorsByInterests(mentors, interests).matchMessage
                  : `${filteredMentors.length} mentor${filteredMentors.length !== 1 ? 's' : ''} available`
                }
              </p>
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm text-white/50">Your interests:</span>
                  {interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <InputField
                label="Search Mentors"
                type="text"
                placeholder="Search by name, skills, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg"
              >
                {domains.map(domain => (
                  <option key={domain} value={domain} className="bg-slate-800 text-white">
                    {domain === 'all' ? 'All Domains' : domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass-input w-full px-3 py-2 rounded-lg"
              >
                <option value="rating" className="bg-slate-800 text-white">Highest Rated</option>
                {interests.length > 0 && <option value="relevance" className="bg-slate-800 text-white">Most Relevant</option>}
                <option value="sessions" className="bg-slate-800 text-white">Most Sessions</option>
                <option value="experience" className="bg-slate-800 text-white">Most Experience</option>
                <option value="name" className="bg-slate-800 text-white">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center"
            >
              <svg
                className={`w-4 h-4 mr-1 transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
            
            {(searchTerm || selectedDomain !== 'all' || selectedExperience !== 'all' || 
              selectedAvailability !== 'all' || selectedRating !== 'all') && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-white/10 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level} className="bg-slate-800 text-white">
                        {level === 'all' ? 'All Levels' : level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Availability
                  </label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                  >
                    {availabilityOptions.map(option => (
                      <option key={option} value={option} className="bg-slate-800 text-white">
                        {option === 'all' ? 'All Availability' : option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="glass-input w-full px-3 py-2 rounded-lg"
                  >
                    {ratingOptions.map(rating => (
                      <option key={rating} value={rating} className="bg-slate-800 text-white">
                        {rating === 'all' ? 'All Ratings' : rating + ' Stars'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mentor Grid */}
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="glass-card text-center py-12">
            <div className="bg-white/10 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center border border-white/20">
              <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No mentors found</h3>
            <p className="text-white/70 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentors;
