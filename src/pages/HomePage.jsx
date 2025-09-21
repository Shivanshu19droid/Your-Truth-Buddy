import React, { useState, useEffect } from "react";
import { Question, User, UserAnswer } from "@/entities/all";
import { supabase } from "@/lib/supabase";
import { Target, Flame, Trophy, BookOpen } from "lucide-react";
import HotQuestionsCarousel from "@/components/HotQuestionsCarousel";
import QuestionCard from "@/components/QuestionCard";
import StatsCard from "@/components/StatsCard";
import { initializeDatabase } from "@/lib/database-init";

export default function HomePage() {

  const [hotQuestions, setHotQuestions] = useState([]);
  const [regularQuestions, setRegularQuestions] = useState([]);
  const [userStats, setUserStats] = useState({
    points: 0,
    streak: 0,
    questionsAnswered: 0,
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const initializeDatabaseData = async () => {
    try {
      await initializeDatabase();
    } catch (error) {
      console.log("Error initializing database:", error);
    }
  };

  const loadData = async () => {
    try {
      // Load user (localStorage fallback)
      const user = await User.me();
      setCurrentUser(user);

      // Get user's answer count
      const userAnswers = await UserAnswer.findByUser(user.id);

      setUserStats({
        points: user.points || 0,
        streak: user.current_streak || 0,
        questionsAnswered: user.number_of_questions_solved,
      });

      // Initialize DB with sample questions if needed
      await initializeDatabaseData();

      // Fetch all questions
      const today = new Date().toISOString().split("T")[0];
      const allQuestions = await Question.list();

      const hot = allQuestions
        .filter((q) => q.is_hot && q.hot_date === today)
        .slice(0, 5);
      const regular = allQuestions
        .filter((q) => !q.is_hot)
        .slice(0, 6);

      setHotQuestions(hot);
      setRegularQuestions(regular);
    } catch (error) {
      console.log("Error loading user or questions:", error);
    }
  };

const handleAnswerQuestion = async (question, selectedAnswer) => {
  if (!currentUser) return;

  try {
    const attemptedQuestionIds = currentUser.attempted_questions || [];

    if (attemptedQuestionIds.includes(question.id)) {
      console.log("No points awarded: question already attempted");
      return;
    }

    const isCorrect = selectedAnswer === question.correct_answer;
    const pointsEarned = question.is_hot ? (isCorrect ? 3 : 0) : (isCorrect ? 1 : 0);

    await UserAnswer.create({
      user_id: currentUser.id,
      question_id: question.id,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      points_earned: pointsEarned,
      is_hot_question: question.is_hot || false,
    });

    const newPoints = (userStats.points || 0) + pointsEarned;
    const newQuestionsAnswered = (userStats.questionsAnswered || 0) + 1;

    setUserStats((prev) => ({
      ...prev,
      points: newPoints,
      questionsAnswered: newQuestionsAnswered,
    }));

    // Prepare correct Supabase update object
    let userDataToUpdate = {
      points: newPoints,
      number_of_questions_solved: (currentUser.number_of_questions_solved || 0) + 1,
      attempted_questions: [...attemptedQuestionIds, question.id],
    };

    if (question.is_hot) {
  // Increment hot_attempted count
  const newHotAttempted = (currentUser.hot_solved || 0) + 1;

  // Always update this column
  userDataToUpdate.hot_solved = newHotAttempted;

  // If reached 5 (or the total number of hot questions), mark as true
  if (newHotAttempted >= 5) {
    userDataToUpdate.has_attempted_today_hot = true;
  }
}


    // Update Supabase
    const { data, error } = await supabase
      .from("users")
      .update(userDataToUpdate)
      .eq("id", currentUser.id);

    if (error) console.log("Supabase update error:", error);
    else console.log("Supabase update successful:", data);

    // Update local storage / fallback
    await User.updateMyUserData(userDataToUpdate);
    setCurrentUser((prev) => ({ ...prev, ...userDataToUpdate }));

  } catch (error) {
    console.log("Error recording answer:", error);
  }
};






  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Points"
          value={userStats.points}
          icon={Target}
          gradient="from-purple-500 to-indigo-500"
          delay={0}
        />
        <StatsCard
          title="Current Streak"
          value={`${userStats.streak} days`}
          icon={Flame}
          gradient="from-orange-500 to-red-500"
          delay={0.1}
        />
        <StatsCard
          title="Questions Solved"
          value={userStats.questionsAnswered}
          icon={Trophy}
          gradient="from-green-500 to-emerald-500"
          delay={0.2}
        />
      </div>

      {/* Hot Questions Carousel */}
      <HotQuestionsCarousel
        questions={hotQuestions}
        onAnswerQuestion={handleAnswerQuestion}
      />

      {/* Regular Questions */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Practice Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {regularQuestions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onAnswer={handleAnswerQuestion}
            />
          ))}
        </div>

        {regularQuestions.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              Loading Questions...
            </h3>
            <p className="text-gray-400">
              Setting up your learning experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
