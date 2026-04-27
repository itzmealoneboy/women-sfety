import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Award, TrendingUp, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const quizQuestions = [
  {
    id: 1,
    question: "What is the national emergency number in India?",
    options: ["100", "101", "112", "108"],
    correct: 2,
    explanation: "112 is the single emergency helpline number that connects to police, fire, and ambulance services."
  },
  {
    id: 2,
    question: "Which act protects women from sexual harassment at workplace?",
    options: ["IPC Section 354", "POSH Act 2013", "Domestic Violence Act", "Dowry Prohibition Act"],
    correct: 1,
    explanation: "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 (POSH Act) provides protection against workplace sexual harassment."
  },
  {
    id: 3,
    question: "What should you do first if you're being followed?",
    options: [
      "Run as fast as you can",
      "Call emergency number",
      "Go to a public place",
      "Confront the person"
    ],
    correct: 2,
    explanation: "Heading to a public place with people around is the safest first step. Then call emergency services."
  },
  {
    id: 4,
    question: "Which article of the Indian Constitution guarantees equality?",
    options: ["Article 14", "Article 21", "Article 15", "Article 19"],
    correct: 0,
    explanation: "Article 14 guarantees equality before law and equal protection of laws to all persons."
  },
  {
    id: 5,
    question: "What is the women's helpline number?",
    options: ["100", "101", "1091", "112"],
    correct: 2,
    explanation: "1091 is the dedicated women's helpline for reporting harassment and violence against women."
  }
]

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [quizQuestions[currentQuestion].id]: optionIndex
    })
    setShowExplanation(true)
    
    if (optionIndex === quizQuestions[currentQuestion].correct) {
      toast.success('Correct answer!')
    } else {
      toast.error('That was incorrect')
    }
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    quizQuestions.forEach(q => {
      if (answers[q.id] === q.correct) correct++
    })
    return { correct, total: quizQuestions.length, percentage: (correct / quizQuestions.length) * 100 }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setShowExplanation(false)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center"
      >
        <div className="mb-6">
          {score.percentage >= 80 ? (
            <Award size={64} className="mx-auto text-yellow-500" />
          ) : score.percentage >= 60 ? (
            <TrendingUp size={64} className="mx-auto text-green-500" />
          ) : (
            <RefreshCw size={64} className="mx-auto text-blue-500" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
        <p className="text-gray-600 mb-6">Your Safety Awareness Score</p>
        
        <div className="text-5xl font-bold text-primary-600 mb-4">
          {score.correct}/{score.total}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${score.percentage}%` }}
          />
        </div>
        
        <p className="text-gray-700 mb-6">
          {score.percentage >= 80
            ? "Excellent! You're well-prepared to handle emergency situations!"
            : score.percentage >= 60
            ? "Good job! Keep learning to improve your safety awareness."
            : "Keep learning! Review the safety tips to improve your knowledge."}
        </p>
        
        <button
          onClick={resetQuiz}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          Take Quiz Again
        </button>
      </motion.div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const isAnswered = answers[question.id] !== undefined

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Safety Awareness Quiz</h3>
          <span className="text-sm">Question {currentQuestion + 1} of {quizQuestions.length}</span>
        </div>
        <div className="w-full bg-primary-800 rounded-full h-1 mt-2">
          <div
            className="bg-white h-1 rounded-full transition-all"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          {question.question}
        </h4>

        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !isAnswered && handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border transition ${
                isAnswered && answers[question.id] === idx
                  ? idx === question.correct
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : isAnswered && idx === question.correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isAnswered && answers[question.id] === idx && (
                  idx === question.correct ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )
                )}
                {isAnswered && idx === question.correct && answers[question.id] !== idx && (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 rounded-lg p-4 mb-6"
            >
              <p className="text-sm text-blue-800">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  )
}
