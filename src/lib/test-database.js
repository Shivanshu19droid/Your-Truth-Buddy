// Test database operations
import { supabase } from './supabase';
import { User, Question, UserAnswer } from '@/entities/all';

export async function testDatabaseOperations() {
  console.log('🧪 Testing database operations...');
  
  try {
    // Test 1: Connection
    console.log('1. Testing connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError);
      return false;
    }
    console.log('✅ Connection successful');

    // Test 2: User creation
    console.log('2. Testing user operations...');
    const currentUser = await User.me();
    console.log('✅ Current user:', currentUser);

    // Test 3: Questions
    console.log('3. Testing questions...');
    const questions = await Question.list();
    console.log('✅ Questions loaded:', questions.length);

    // Test 4: User update
    console.log('4. Testing user update...');
    const updateResult = await User.updateMyUserData({
      full_name: 'Test User ' + Date.now()
    });
    console.log('✅ User update result:', updateResult);

    // Test 5: User answers
    console.log('5. Testing user answers...');
    const userAnswers = await UserAnswer.findByUser(currentUser.id);
    console.log('✅ User answers:', userAnswers.length);

    console.log('🎉 All database tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Function to run tests from browser console
window.testDatabase = testDatabaseOperations;
