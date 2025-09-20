import React, { useState, useEffect } from "react";
import { Question, User, UserAnswer } from "@/entities/all";
import { supabase } from "@/lib/supabase";
import { Target, Flame, Trophy, BookOpen } from "lucide-react";
import HotQuestionsCarousel from "@/components/HotQuestionsCarousel";
import QuestionCard from "@/components/QuestionCard";
import StatsCard from "@/components/StatsCard";
import { initializeDatabase } from "@/lib/database-init";

export default function HomePage() {

  useEffect(() => {
  const testConnection = async () => {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      console.log("Supabase connection error:", error);
    } else {
      console.log("Supabase connection successful. Sample data:", data);
    }
  };

  testConnection();
}, []);

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
        questionsAnswered: userAnswers.length,
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

    const isCorrect = selectedAnswer === question.correct_answer;
    const pointsEarned = question.is_hot
      ? isCorrect
        ? 3
        : 0
      : isCorrect
      ? 1
      : 0;

    try {
      // 1️⃣ Record the answer locally
      await UserAnswer.create({
        user_id: currentUser.id,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        is_hot_question: question.is_hot || false,
      });

      // 2️⃣ Update local user stats
      const newPoints = (userStats.points || 0) + pointsEarned;
      const newQuestionsAnswered = userStats.questionsAnswered + 1;
      setUserStats((prev) => ({
        ...prev,
        points: newPoints,
        questionsAnswered: newQuestionsAnswered,
      }));

      await User.updateMyUserData({
        points: newPoints,
        current_streak: userStats.streak,
      });

      // 3️⃣ Update Supabase (online only)
      if (navigator.onLine) {
        const { error } = await supabase
          .from("users")
          .update({
            points: newPoints,
            current_streak: userStats.streak,
          })
          .eq("id", currentUser.id);

        if (error) console.log("Supabase update error:", error);

        // Optionally, also store attempted question
        const attemptedQuestionIds = currentUser.attempted_question_ids || [];
        if (!attemptedQuestionIds.includes(question.id)) {
          attemptedQuestionIds.push(question.id);
          await supabase
            .from("users")
            .update({ attempted_question_ids: attemptedQuestionIds })
            .eq("id", currentUser.id);

          // Update localStorage fallback
          await User.updateMyUserData({
            attempted_question_ids: attemptedQuestionIds,
          });
        }
      }
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

