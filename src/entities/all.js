import { generateId, getTodayDate, generateUniqueUsername } from '@/utils';
import { supabase, TABLES, testConnection } from '@/lib/supabase';
import {
  FallbackQuestion,
  FallbackUser,
  FallbackUserAnswer,
  FallbackVerificationRequest
} from '@/lib/storage-fallback';

// Current user session management
let currentUserSession = null;
let useSupabase = null; // null = not tested, true = use supabase, false = use fallback

// Session storage keys
const SESSION_KEYS = {
  USER_SESSION: 'truth_buddy_user_session',
  USER_ID: 'truth_buddy_current_user'
};

// Load user session from sessionStorage (persists during browser session)
function loadUserSession() {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEYS.USER_SESSION);
    if (sessionData) {
      currentUserSession = JSON.parse(sessionData);
      console.log('Loaded user session from sessionStorage:', currentUserSession.nickname);
      return currentUserSession;
    }
  } catch (error) {
    console.error('Error loading user session:', error);
  }
  return null;
}

// Save user session to sessionStorage
function saveUserSession(user) {
  try {
    currentUserSession = user;
    sessionStorage.setItem(SESSION_KEYS.USER_SESSION, JSON.stringify(user));
    localStorage.setItem(SESSION_KEYS.USER_ID, user.id);
    console.log('Saved user session:', user.nickname);
  } catch (error) {
    console.error('Error saving user session:', error);
  }
}

// Clear user session
function clearUserSession() {
  currentUserSession = null;
  sessionStorage.removeItem(SESSION_KEYS.USER_SESSION);
  localStorage.removeItem(SESSION_KEYS.USER_ID);
}

// Test Supabase connection and determine which storage to use
async function getStorageMode() {
  if (useSupabase === null) {
    useSupabase = await testConnection();
    console.log(useSupabase ? 'Using Supabase database' : 'Using localStorage fallback');
  }
  return useSupabase;
}

// Question Entity
export const Question = {
  async list() {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackQuestion.list();
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      return FallbackQuestion.list();
    }
  },

  async create(questionData) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackQuestion.create(questionData);
    }

    try {
      const newQuestion = {
        ...questionData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .insert([newQuestion])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating question:', error);
      return FallbackQuestion.create(questionData);
    }
  },

  async findById(id) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackQuestion.findById(id);
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error finding question:', error);
      return FallbackQuestion.findById(id);
    }
  },

  async update(id, updateData) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackQuestion.update(id, updateData);
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.QUESTIONS)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating question:', error);
      return FallbackQuestion.update(id, updateData);
    }
  }
};

// User Entity
export const User = {
  async me() {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUser.me();
    }

    try {
      // First, try to load from session cache
      const sessionUser = loadUserSession();
      if (sessionUser) {
        return sessionUser;
      }

      // Try to get user from localStorage (persistent user ID)
      const currentUserId = localStorage.getItem(SESSION_KEYS.USER_ID);
      if (currentUserId) {
        console.log('Loading user from database with ID:', currentUserId);
        const { data, error } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .eq('id', currentUserId)
          .single();

        if (!error && data) {
          console.log('User found in database:', data.nickname);
          saveUserSession(data);
          return data;
        } else {
          console.log('User not found in database, error:', error);
        }
      }

      // Create a new user only if no existing user found
      console.log('Creating new user...');
      const defaultUser = await this.create({
        nickname: generateUniqueUsername(),
        avatar: '😊',
        points: 0,
        current_streak: 0
      });

      saveUserSession(defaultUser);
      return defaultUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return FallbackUser.me();
    }
  },

  async list() {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUser.list();
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .order('points', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return FallbackUser.list();
    }
  },

  async create(userData) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUser.create(userData);
    }

    try {
      const newUser = {
        ...userData,
        created_at: new Date().toISOString(),
        points: userData.points || 0,
        current_streak: userData.current_streak || 0
      };

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert([newUser])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return FallbackUser.create(userData);
    }
  },

  async updateMyUserData(updateData) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      console.log('Using fallback storage for user update');
      return FallbackUser.updateMyUserData(updateData);
    }

    try {
      const currentUser = await this.me();
      console.log('Updating user data for user:', currentUser.id, 'with data:', updateData);

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updateData)
        .eq('id', currentUser.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('User data updated successfully:', data);

      // Update both session cache and sessionStorage
      saveUserSession(data);
      return data;
    } catch (error) {
      console.error('Error updating user in Supabase, falling back to localStorage:', error);
      return FallbackUser.updateMyUserData(updateData);
    }
  },

  // Method to refresh user data from database
  async refreshUserData() {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUser.me();
    }

    try {
      const currentUserId = localStorage.getItem(SESSION_KEYS.USER_ID);
      if (!currentUserId) {
        return null;
      }

      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', currentUserId)
        .single();

      if (!error && data) {
        saveUserSession(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  },

  // Method to clear user session (for logout)
  clearSession() {
    clearUserSession();
  }
};

// UserAnswer Entity
export const UserAnswer = {
  async list() {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUserAnswer.list();
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.USER_ANSWERS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user answers:', error);
      return FallbackUserAnswer.list();
    }
  },

  async create(answerData) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUserAnswer.create(answerData);
    }

    try {
      const newAnswer = {
        ...answerData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLES.USER_ANSWERS)
        .insert([newAnswer])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user answer:', error);
      return FallbackUserAnswer.create(answerData);
    }
  },

  async findByUser(userId) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUserAnswer.findByUser(userId);
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.USER_ANSWERS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user answers:', error);
      return FallbackUserAnswer.findByUser(userId);
    }
  },

  async findByQuestion(questionId) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackUserAnswer.findByQuestion(questionId);
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.USER_ANSWERS)
        .select('*')
        .eq('question_id', questionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching question answers:', error);
      return FallbackUserAnswer.findByQuestion(questionId);
    }
  }
};

// Verification Request Entity (for the verify page)
export const VerificationRequest = {
  async create(requestData) {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackVerificationRequest.create(requestData);
    }

    try {
      const newRequest = {
        ...requestData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from(TABLES.VERIFICATION_REQUESTS)
        .insert([newRequest])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating verification request:', error);
      return FallbackVerificationRequest.create(requestData);
    }
  },

  async list() {
    const useSupabaseStorage = await getStorageMode();
    if (!useSupabaseStorage) {
      return FallbackVerificationRequest.list();
    }

    try {
      const { data, error } = await supabase
        .from(TABLES.VERIFICATION_REQUESTS)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      return FallbackVerificationRequest.list();
    }
  }
};
