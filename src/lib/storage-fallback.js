// Fallback storage system using localStorage when Supabase is not available
import { generateId, generateUniqueUsername } from '@/utils';

const STORAGE_KEYS = {
  QUESTIONS: 'truth_buddy_questions',
  USERS: 'truth_buddy_users', 
  USER_ANSWERS: 'truth_buddy_user_answers',
  VERIFICATION_REQUESTS: 'truth_buddy_verification_requests',
  CURRENT_USER: 'truth_buddy_current_user'
};

// Helper functions for localStorage operations
function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return [];
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
  }
}

// Fallback Question Entity
export const FallbackQuestion = {
  async list() {
    return getFromStorage(STORAGE_KEYS.QUESTIONS);
  },

  async create(questionData) {
    const questions = getFromStorage(STORAGE_KEYS.QUESTIONS);
    const newQuestion = {
      id: generateId(),
      ...questionData,
      created_at: new Date().toISOString()
    };
    questions.push(newQuestion);
    saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
    return newQuestion;
  },

  async findById(id) {
    const questions = getFromStorage(STORAGE_KEYS.QUESTIONS);
    return questions.find(q => q.id === id);
  },

  async update(id, updateData) {
    const questions = getFromStorage(STORAGE_KEYS.QUESTIONS);
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updateData };
      saveToStorage(STORAGE_KEYS.QUESTIONS, questions);
      return questions[index];
    }
    return null;
  }
};

// Fallback User Entity
export const FallbackUser = {
  async me() {
    // Check session storage first
    try {
      const sessionData = sessionStorage.getItem('truth_buddy_user_session');
      if (sessionData) {
        const user = JSON.parse(sessionData);
        console.log('Loaded fallback user from session:', user.nickname);
        return user;
      }
    } catch (error) {
      console.error('Error loading fallback user session:', error);
    }

    const currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUserId) {
      const defaultUser = await this.create({
        nickname: generateUniqueUsername(),
        avatar: '😊',
        points: 0,
        current_streak: 0
      });
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, defaultUser.id);
      // Save to session storage
      sessionStorage.setItem('truth_buddy_user_session', JSON.stringify(defaultUser));
      return defaultUser;
    }

    const users = getFromStorage(STORAGE_KEYS.USERS);
    const user = users.find(u => u.id === currentUserId);
    if (!user) {
      const newUser = await this.create({
        nickname: generateUniqueUsername(),
        avatar: '😊',
        points: 0,
        current_streak: 0
      });
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, newUser.id);
      // Save to session storage
      sessionStorage.setItem('truth_buddy_user_session', JSON.stringify(newUser));
      return newUser;
    }

    // Save to session storage
    sessionStorage.setItem('truth_buddy_user_session', JSON.stringify(user));
    return user;
  },

  async list() {
    return getFromStorage(STORAGE_KEYS.USERS);
  },

  async create(userData) {
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const newUser = {
      id: generateId(),
      ...userData,
      created_at: new Date().toISOString(),
      points: userData.points || 0,
      current_streak: userData.current_streak || 0
    };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  async updateMyUserData(updateData) {
    const currentUser = await this.me();
    const users = getFromStorage(STORAGE_KEYS.USERS);
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updateData };
      saveToStorage(STORAGE_KEYS.USERS, users);

      // Update session storage
      sessionStorage.setItem('truth_buddy_user_session', JSON.stringify(users[index]));
      console.log('Updated fallback user session:', users[index].nickname);

      return users[index];
    }
    return null;
  }
};

// Fallback UserAnswer Entity
export const FallbackUserAnswer = {
  async list() {
    return getFromStorage(STORAGE_KEYS.USER_ANSWERS);
  },

  async create(answerData) {
    const answers = getFromStorage(STORAGE_KEYS.USER_ANSWERS);
    const newAnswer = {
      id: generateId(),
      ...answerData,
      created_at: new Date().toISOString()
    };
    answers.push(newAnswer);
    saveToStorage(STORAGE_KEYS.USER_ANSWERS, answers);
    return newAnswer;
  },

  async findByUser(userId) {
    const answers = getFromStorage(STORAGE_KEYS.USER_ANSWERS);
    return answers.filter(a => a.user_id === userId);
  },

  async findByQuestion(questionId) {
    const answers = getFromStorage(STORAGE_KEYS.USER_ANSWERS);
    return answers.filter(a => a.question_id === questionId);
  }
};

// Fallback VerificationRequest Entity
export const FallbackVerificationRequest = {
  async create(requestData) {
    const requests = getFromStorage(STORAGE_KEYS.VERIFICATION_REQUESTS);
    const newRequest = {
      id: generateId(),
      ...requestData,
      created_at: new Date().toISOString()
    };
    requests.push(newRequest);
    saveToStorage(STORAGE_KEYS.VERIFICATION_REQUESTS, requests);
    return newRequest;
  },

  async list() {
    return getFromStorage(STORAGE_KEYS.VERIFICATION_REQUESTS);
  }
};
