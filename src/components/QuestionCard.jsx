import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";

export default function QuestionCard({ question, onAnswer }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (onAnswer) {
      setTimeout(() => {
        onAnswer(question, answerIndex);
      }, 1500);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: 'bg-blue-100 text-blue-700',
      science: 'bg-purple-100 text-purple-700',
      technology: 'bg-indigo-100 text-indigo-700',
      history: 'bg-amber-100 text-amber-700',
      sports: 'bg-green-100 text-green-700',
      entertainment: 'bg-pink-100 text-pink-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 bg-white border-gray-100">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty?.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={getCategoryColor(question.category)}>
                {question.category}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold">1 Point</span>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
            {question.title}
          </h3>

          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={!isAnswered ? { scale: 1.01 } : {}}
                whileTap={!isAnswered ? { scale: 0.99 } : {}}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswer === index
                    ? selectedAnswer === question.correct_answer
                      ? 'bg-green-100 border-green-400 text-green-800'
                      : 'bg-red-100 border-red-400 text-red-800'
                    : isAnswered && index === question.correct_answer
                    ? 'bg-green-100 border-green-400 text-green-800'
                    : 'bg-white border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                    selectedAnswer === index
                      ? selectedAnswer === question.correct_answer
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-red-500 border-red-500 text-white'
                      : isAnswered && index === question.correct_answer
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 text-gray-600'
                  }`}>
                    {isAnswered && index === question.correct_answer ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {isAnswered && question.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
            >
              <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
              <p className="text-blue-700 text-sm">{question.explanation}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
