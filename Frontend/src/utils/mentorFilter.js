/**
 * Utility functions for filtering mentors based on user interests
 */

/**
 * Filter mentors based on user interests
 * @param {Array} mentors - Array of mentor objects
 * @param {Array} userInterests - Array of user's selected interests
 * @returns {Object} - Object containing filtered mentors and match info
 */
export const filterMentorsByInterests = (mentors, userInterests) => {
  if (!userInterests || userInterests.length === 0) {
    return {
      filteredMentors: mentors,
      matchedCount: mentors.length,
      totalMentors: mentors.length,
      matchMessage: "Showing all available mentors"
    };
  }

  const filteredMentors = mentors.filter(mentor => {
    // Check if mentor's expertise matches any of user's interests
    return mentor.expertise.some(expertise => 
      userInterests.some(interest => 
        expertise.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(expertise.toLowerCase())
      )
    );
  });

  const matchMessage = filteredMentors.length > 0 
    ? `Based on your interests, we found ${filteredMentors.length} mentor${filteredMentors.length !== 1 ? 's' : ''} for you`
    : "No mentors found matching your interests. Try adjusting your interests or browse all mentors.";

  return {
    filteredMentors,
    matchedCount: filteredMentors.length,
    totalMentors: mentors.length,
    matchMessage
  };
};

/**
 * Sort mentors by relevance to user interests
 * @param {Array} mentors - Array of mentor objects
 * @param {Array} userInterests - Array of user's selected interests
 * @returns {Array} - Sorted array of mentors
 */
export const sortMentorsByRelevance = (mentors, userInterests) => {
  if (!userInterests || userInterests.length === 0) {
    return mentors;
  }

  return mentors.map(mentor => {
    let relevanceScore = 0;
    
    // Calculate relevance score based on matching expertise
    mentor.expertise.forEach(expertise => {
      userInterests.forEach(interest => {
        if (expertise.toLowerCase() === interest.toLowerCase()) {
          relevanceScore += 10; // Exact match gets highest score
        } else if (expertise.toLowerCase().includes(interest.toLowerCase()) ||
                   interest.toLowerCase().includes(expertise.toLowerCase())) {
          relevanceScore += 5; // Partial match gets medium score
        }
      });
    });

    // Add rating bonus
    relevanceScore += mentor.rating * 2;
    
    // Add experience bonus
    relevanceScore += Math.min(mentor.experience / 10, 5);

    return { ...mentor, relevanceScore };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Get domain-specific mentors
 * @param {Array} mentors - Array of mentor objects
 * @param {string} domain - Domain name to filter by
 * @returns {Array} - Filtered array of mentors
 */
export const getMentorsByDomain = (mentors, domain) => {
  if (!domain) return mentors;
  
  return mentors.filter(mentor => 
    mentor.expertise.some(expertise => 
      expertise.toLowerCase().includes(domain.toLowerCase()) ||
      domain.toLowerCase().includes(expertise.toLowerCase())
    )
  );
};

/**
 * Search mentors by name, expertise, or bio
 * @param {Array} mentors - Array of mentor objects
 * @param {string} query - Search query
 * @returns {Array} - Filtered array of mentors
 */
export const searchMentors = (mentors, query) => {
  if (!query || query.trim() === '') return mentors;
  
  const searchTerm = query.toLowerCase().trim();
  
  return mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchTerm) ||
    mentor.expertise.some(expertise => expertise.toLowerCase().includes(searchTerm)) ||
    mentor.bio.toLowerCase().includes(searchTerm)
  );
};

/**
 * Get recommended mentors for a user
 * @param {Array} mentors - Array of mentor objects
 * @param {Array} userInterests - Array of user's selected interests
 * @param {number} limit - Maximum number of recommendations
 * @returns {Array} - Array of recommended mentors
 */
export const getRecommendedMentors = (mentors, userInterests, limit = 3) => {
  if (!userInterests || userInterests.length === 0) {
    // Return top rated mentors if no interests selected
    return mentors
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  const filtered = filterMentorsByInterests(mentors, userInterests).filteredMentors;
  const sorted = sortMentorsByRelevance(filtered, userInterests);
  
  return sorted.slice(0, limit);
};
