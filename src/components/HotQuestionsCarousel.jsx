import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Flame, Star, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HotQuestionsCarousel({ questions = [], onAnswerQuestion }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [completed, setCompleted] = useState(false);

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setCompleted(true); // mark as done
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedAnswer(null);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    if (onAnswerQuestion) {
      setTimeout(() => {
        onAnswerQuestion(questions[currentIndex], answerIndex);
        nextQuestion();
      }, 1500);
    }
  };

  // If no questions
  if (!questions.length) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-8 text-center">
          <Flame className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Hot Questions Today</h3>
          <p className="text-gray-500">Check back later for fresh challenges!</p>
        </CardContent>
      </Card>
    );
  }

  // If completed all questions
  if (completed) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
        <CardContent className="p-10 text-center">
          <PartyPopper className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            You’ve answered all the Hot Questions for today 🎉
          </h3>
          <p className="text-gray-600">Come back tomorrow for new challenges and more points!</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-gray-800">Hot Questions</h2>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            3x Points
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex gap-1">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-full -translate-y-16 translate-x-16 opacity-10" />
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Difficulty + Points */}
              <div className="flex justify-between items-start mb-4">
                <Badge className={`
                  ${currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
                  ${currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${currentQuestion?.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {currentQuestion?.difficulty?.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1 text-orange-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">3 Points</span>
                </div>
              </div>

              {/* Question */}
              <h3 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
                {currentQuestion?.title}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options?.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                      selectedAnswer === index
                        ? selectedAnswer === currentQuestion.correct_answer
                          ? 'bg-green-100 border-green-400 text-green-800'
                          : 'bg-red-100 border-red-400 text-red-800'
                        : selectedAnswer !== null && index === currentQuestion.correct_answer
                        ? 'bg-green-100 border-green-400 text-green-800'
                        : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                        selectedAnswer === index
                          ? selectedAnswer === currentQuestion.correct_answer
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'bg-red-500 border-red-500 text-white'
                          : selectedAnswer !== null && index === currentQuestion.correct_answer
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Explanation */}
              {selectedAnswer !== null && currentQuestion?.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                >
                  <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                  <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="ghost"
              onClick={prevQuestion}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={nextQuestion}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
