// TV Show Progress Tracking Utility

/**
 * Get user's progress for a specific TV show
 * @param {string} showId - The TV show ID
 * @param {string} profileId - The user profile ID
 * @returns {Object} Progress object with season and episode
 */
export const getTVProgress = (showId, profileId) => {
  try {
    const progressKey = `tv_progress_${profileId}`;
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Return stored progress or default to season 1, episode 1
    return allProgress[showId] || { season: 1, episode: 1 };
  } catch (error) {
    console.error('Error getting TV progress:', error);
    return { season: 1, episode: 1 };
  }
};

/**
 * Save user's progress for a specific TV show
 * @param {string} showId - The TV show ID
 * @param {string} profileId - The user profile ID
 * @param {number} season - Current season number
 * @param {number} episode - Current episode number
 */
export const saveTVProgress = (showId, profileId, season, episode) => {
  try {
    const progressKey = `tv_progress_${profileId}`;
    const allProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    
    // Update progress for this show
    allProgress[showId] = {
      season: parseInt(season),
      episode: parseInt(episode),
      lastWatched: new Date().toISOString()
    };
    
    localStorage.setItem(progressKey, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error saving TV progress:', error);
  }
};

/**
 * Get the next episode for a TV show
 * @param {string} showId - The TV show ID
 * @param {string} profileId - The user profile ID
 * @param {number} currentSeason - Current season number
 * @param {number} currentEpisode - Current episode number
 * @returns {Object} Next episode object with season and episode
 */
export const getNextEpisode = (showId, profileId, currentSeason, currentEpisode) => {
  // For now, just increment episode (in a real app, you'd check episode counts per season)
  const nextEpisode = parseInt(currentEpisode) + 1;
  
  // Save the next episode as progress
  saveTVProgress(showId, profileId, currentSeason, nextEpisode);
  
  return {
    season: parseInt(currentSeason),
    episode: nextEpisode
  };
};

/**
 * Clear all progress for a user profile
 * @param {string} profileId - The user profile ID
 */
export const clearAllProgress = (profileId) => {
  try {
    const progressKey = `tv_progress_${profileId}`;
    localStorage.removeItem(progressKey);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
};

/**
 * Get all TV show progress for a user profile
 * @param {string} profileId - The user profile ID
 * @returns {Object} All progress data for the profile
 */
export const getAllTVProgress = (profileId) => {
  try {
    const progressKey = `tv_progress_${profileId}`;
    return JSON.parse(localStorage.getItem(progressKey) || '{}');
  } catch (error) {
    console.error('Error getting all progress:', error);
    return {};
  }
};