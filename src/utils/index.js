// Utility function to create page URLs
export function createPageUrl(pageName) {
  const pageRoutes = {
    'Home': '/',
    'Verify': '/verify',
    'Leaderboard': '/leaderboard',
    'Profile': '/profile'
  };
  
  return pageRoutes[pageName] || '/';
}

// Generate a unique ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Generate a unique username
export function generateUniqueUsername() {
  const adjectives = [
    'Smart', 'Clever', 'Bright', 'Quick', 'Sharp', 'Wise', 'Bold', 'Swift',
    'Keen', 'Alert', 'Agile', 'Brave', 'Cool', 'Epic', 'Fast', 'Great',
    'Happy', 'Lucky', 'Magic', 'Noble', 'Power', 'Royal', 'Super', 'Ultra',
    'Mega', 'Prime', 'Elite', 'Pro', 'Star', 'Ace', 'Top', 'Max'
  ];

  const nouns = [
    'Learner', 'Scholar', 'Genius', 'Master', 'Expert', 'Wizard', 'Hero',
    'Champion', 'Player', 'Gamer', 'Seeker', 'Hunter', 'Explorer', 'Finder',
    'Solver', 'Thinker', 'Creator', 'Builder', 'Maker', 'Coder', 'Hacker',
    'Ninja', 'Warrior', 'Knight', 'Guardian', 'Defender', 'Ranger', 'Scout',
    'Pioneer', 'Voyager', 'Traveler', 'Adventurer'
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 9999) + 1;

  return `${adjective}${noun}${number}`;
}

// Format date to YYYY-MM-DD
export function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate() {
  return formatDate(new Date());
}
