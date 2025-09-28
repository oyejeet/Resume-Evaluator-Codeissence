import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star, 
  Trophy, 
  Brain,
  MessageSquare,
  Timer,
  Target
} from "lucide-react";

// Hardcoded interview questions for different job types
const interviewQuestions = {
  "Frontend Developer": [
    {
      id: 1,
      question: "What is the difference between let, const, and var in JavaScript?",
      type: "technical",
      expectedKeywords: ["block scope", "hoisting", "reassignment", "immutable"],
      points: 20
    },
    {
      id: 2,
      question: "Explain the concept of closures in JavaScript with an example.",
      type: "technical",
      expectedKeywords: ["function", "scope", "lexical", "outer function"],
      points: 20
    },
    {
      id: 3,
      question: "How do you optimize React component performance?",
      type: "technical",
      expectedKeywords: ["memo", "useMemo", "useCallback", "virtual dom"],
      points: 20
    },
    {
      id: 4,
      question: "Describe a challenging project you worked on and how you solved it.",
      type: "behavioral",
      expectedKeywords: ["problem", "solution", "learning", "teamwork"],
      points: 20
    },
    {
      id: 5,
      question: "How do you stay updated with the latest web development trends?",
      type: "behavioral",
      expectedKeywords: ["learning", "community", "blogs", "practice"],
      points: 20
    }
  ],
  "Backend Developer": [
    {
      id: 1,
      question: "Explain the difference between SQL and NoSQL databases.",
      type: "technical",
      expectedKeywords: ["relational", "schema", "scalability", "consistency"],
      points: 20
    },
    {
      id: 2,
      question: "What is REST API and how does it differ from GraphQL?",
      type: "technical",
      expectedKeywords: ["http", "endpoints", "over-fetching", "schema"],
      points: 20
    },
    {
      id: 3,
      question: "How do you handle database migrations in production?",
      type: "technical",
      expectedKeywords: ["backup", "rollback", "testing", "zero-downtime"],
      points: 20
    },
    {
      id: 4,
      question: "Describe your experience with microservices architecture.",
      type: "behavioral",
      expectedKeywords: ["scalability", "communication", "deployment", "monitoring"],
      points: 20
    },
    {
      id: 5,
      question: "How do you ensure code quality in your projects?",
      type: "behavioral",
      expectedKeywords: ["testing", "code review", "documentation", "standards"],
      points: 20
    }
  ],
  "Data Scientist": [
    {
      id: 1,
      question: "Explain the difference between supervised and unsupervised learning.",
      type: "technical",
      expectedKeywords: ["labeled data", "clustering", "classification", "regression"],
      points: 20
    },
    {
      id: 2,
      question: "What is overfitting and how do you prevent it?",
      type: "technical",
      expectedKeywords: ["validation", "regularization", "cross-validation", "bias"],
      points: 20
    },
    {
      id: 3,
      question: "Describe your experience with machine learning model deployment.",
      type: "technical",
      expectedKeywords: ["production", "monitoring", "scaling", "versioning"],
      points: 20
    },
    {
      id: 4,
      question: "How do you approach a new data science problem?",
      type: "behavioral",
      expectedKeywords: ["exploration", "hypothesis", "experimentation", "validation"],
      points: 20
    },
    {
      id: 5,
      question: "Tell me about a time when your analysis led to significant business impact.",
      type: "behavioral",
      expectedKeywords: ["results", "metrics", "stakeholders", "implementation"],
      points: 20
    }
  ],
  "Product Manager": [
    {
      id: 1,
      question: "How do you prioritize features in a product roadmap?",
      type: "technical",
      expectedKeywords: ["user value", "business impact", "effort", "stakeholders"],
      points: 20
    },
    {
      id: 2,
      question: "Explain the difference between OKRs and KPIs.",
      type: "technical",
      expectedKeywords: ["objectives", "key results", "metrics", "alignment"],
      points: 20
    },
    {
      id: 3,
      question: "How do you handle conflicting requirements from different stakeholders?",
      type: "behavioral",
      expectedKeywords: ["communication", "prioritization", "data", "consensus"],
      points: 20
    },
    {
      id: 4,
      question: "Describe your experience with agile methodologies.",
      type: "behavioral",
      expectedKeywords: ["sprints", "retrospectives", "collaboration", "iterative"],
      points: 20
    },
    {
      id: 5,
      question: "How do you measure product success?",
      type: "behavioral",
      expectedKeywords: ["metrics", "user feedback", "business goals", "analytics"],
      points: 20
    }
  ]
};

const AIInterview = ({ jobTitle = "Frontend Developer", onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const questions = interviewQuestions[jobTitle] || interviewQuestions["Frontend Developer"];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer for each question (2 minutes)
  useEffect(() => {
    if (isInterviewStarted && !isInterviewCompleted && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isInterviewStarted && !isInterviewCompleted) {
      // Auto-submit if time runs out
      handleAnswerSubmit("");
    }
  }, [timeRemaining, isInterviewStarted, isInterviewCompleted]);

  const startInterview = () => {
    setIsInterviewStarted(true);
    setTimeRemaining(120); // 2 minutes per question
  };

  const handleAnswerSubmit = (answer) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    // Simulate AI typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeRemaining(120); // Reset timer for next question
      } else {
        // Interview completed
        calculateScore(newAnswers);
        setIsInterviewCompleted(true);
      }
    }, 2000);
  };

  const calculateScore = (allAnswers) => {
    let totalScore = 0;
    let feedbackText = "";

    questions.forEach((question, index) => {
      const answer = allAnswers[question.id] || "";
      const answerLower = answer.toLowerCase();
      
      // Simple keyword matching for scoring
      let questionScore = 0;
      const matchedKeywords = question.expectedKeywords.filter(keyword => 
        answerLower.includes(keyword.toLowerCase())
      );
      
      // Calculate score based on matched keywords
      questionScore = Math.min(question.points, (matchedKeywords.length / question.expectedKeywords.length) * question.points);
      
      // Bonus points for longer, more detailed answers
      if (answer.length > 50) questionScore += 2;
      if (answer.length > 100) questionScore += 3;
      
      totalScore += Math.round(questionScore);
    });

    // Generate feedback based on score
    if (totalScore >= 90) {
      feedbackText = "Excellent! You demonstrated strong technical knowledge and clear communication. You're well-prepared for this role.";
    } else if (totalScore >= 75) {
      feedbackText = "Good performance! You showed solid understanding with room for improvement in some areas. Keep practicing!";
    } else if (totalScore >= 60) {
      feedbackText = "Fair performance. Consider reviewing the technical concepts and practicing your communication skills.";
    } else {
      feedbackText = "Keep learning! Focus on understanding the core concepts and practice explaining your thoughts clearly.";
    }

    setScore(totalScore);
    setFeedback(feedbackText);
  };

  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsInterviewStarted(false);
    setIsInterviewCompleted(false);
    setScore(0);
    setFeedback("");
    setTimeRemaining(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isInterviewCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-green/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-theme-green to-theme-green-light rounded-full">
                <Trophy className="h-8 w-8 text-theme-black" />
              </div>
            </div>
            <CardTitle className="text-2xl text-theme-green">Interview Completed!</CardTitle>
            <CardDescription className="text-theme-green/70">
              Here are your results and feedback
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-theme-green mb-2">{score}/100</div>
              <div className="text-lg text-theme-green/80 mb-4">Overall Score</div>
              
              <div className="w-full bg-theme-black/50 rounded-full h-4 mb-6">
                <div 
                  className={`h-4 rounded-full transition-all duration-1000 ${
                    score >= 90 ? 'bg-gradient-to-r from-theme-green to-theme-green-light' :
                    score >= 75 ? 'bg-gradient-to-r from-theme-cyan to-theme-cyan-light' :
                    score >= 60 ? 'bg-gradient-to-r from-theme-orange to-theme-orange-light' :
                    'bg-gradient-to-r from-theme-purple to-theme-purple-light'
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-theme-black/30 rounded-xl p-6 border border-theme-green/20">
              <h3 className="text-lg font-semibold text-theme-green mb-3 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI Feedback
              </h3>
              <p className="text-theme-green/80 leading-relaxed">{feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-theme-black/30 rounded-lg p-4 border border-theme-cyan/20">
                <div className="text-2xl font-bold text-theme-cyan">{questions.length}</div>
                <div className="text-sm text-theme-cyan/70">Questions Answered</div>
              </div>
              <div className="bg-theme-black/30 rounded-lg p-4 border border-theme-purple/20">
                <div className="text-2xl font-bold text-theme-purple">{Math.round(score/questions.length)}</div>
                <div className="text-sm text-theme-purple/70">Average Score</div>
              </div>
              <div className="bg-theme-black/30 rounded-lg p-4 border border-theme-orange/20">
                <div className="text-2xl font-bold text-theme-orange">
                  {score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B+' : score >= 60 ? 'B' : 'C'}
                </div>
                <div className="text-sm text-theme-orange/70">Grade</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={resetInterview}
                className="bg-gradient-to-r from-theme-cyan to-theme-cyan-light text-theme-black hover:from-theme-cyan-light hover:to-theme-cyan"
              >
                Retake Interview
              </Button>
              <Button 
                onClick={() => onComplete && onComplete(score, feedback)}
                className="bg-gradient-to-r from-theme-green to-theme-green-light text-theme-black hover:from-theme-green-light hover:to-theme-green"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isInterviewStarted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-green/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-r from-theme-green to-theme-green-light rounded-full">
                <Bot className="h-8 w-8 text-theme-black" />
              </div>
            </div>
            <CardTitle className="text-2xl text-theme-green">AI Interview Simulation</CardTitle>
            <CardDescription className="text-theme-green/70">
              Practice your interview skills with our AI interviewer
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-theme-black/30 rounded-xl p-6 border border-theme-green/20">
              <h3 className="text-lg font-semibold text-theme-green mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Interview Details
              </h3>
              <div className="space-y-3 text-theme-green/80">
                <div className="flex items-center justify-between">
                  <span>Job Position:</span>
                  <Badge className="bg-theme-green/20 text-theme-green">{jobTitle}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Questions:</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time per Question:</span>
                  <span className="font-semibold">2 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Duration:</span>
                  <span className="font-semibold">{questions.length * 2} minutes</span>
                </div>
              </div>
            </div>

            <div className="bg-theme-black/30 rounded-xl p-6 border border-theme-cyan/20">
              <h3 className="text-lg font-semibold text-theme-cyan mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                How it Works
              </h3>
              <ul className="space-y-2 text-theme-cyan/80">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-theme-cyan" />
                  Answer questions naturally as you would in a real interview
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-theme-cyan" />
                  Our AI will analyze your responses and provide feedback
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-theme-cyan" />
                  Get a detailed score and improvement suggestions
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={startInterview}
                size="lg"
                className="bg-gradient-to-r from-theme-green to-theme-green-light text-theme-black hover:from-theme-green-light hover:to-theme-green text-lg px-8 py-3"
              >
                Start AI Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-theme-dark to-theme-black border border-theme-green/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-2 bg-theme-green/10 rounded-lg mr-3">
                <Bot className="h-5 w-5 text-theme-green" />
              </div>
              <div>
                <CardTitle className="text-theme-green">AI Interviewer</CardTitle>
                <CardDescription className="text-theme-green/70">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-theme-cyan/10 px-3 py-1 rounded-full">
                <Timer className="h-4 w-4 text-theme-cyan mr-2" />
                <span className="text-theme-cyan font-semibold">{formatTime(timeRemaining)}</span>
              </div>
              <div className="w-32">
                <Progress 
                  value={((120 - timeRemaining) / 120) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-theme-black/30 rounded-xl p-6 border border-theme-green/20">
            <div className="flex items-start mb-4">
              <div className="p-2 bg-theme-green/10 rounded-lg mr-3">
                <MessageSquare className="h-5 w-5 text-theme-green" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-theme-green mb-2">
                  {currentQuestion.question}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge className={`px-2 py-1 text-xs ${
                    currentQuestion.type === 'technical' 
                      ? 'bg-theme-cyan/20 text-theme-cyan border border-theme-cyan/30'
                      : 'bg-theme-purple/20 text-theme-purple border border-theme-purple/30'
                  }`}>
                    {currentQuestion.type === 'technical' ? 'Technical' : 'Behavioral'}
                  </Badge>
                  <span className="text-sm text-theme-green/60">
                    {currentQuestion.points} points
                  </span>
                </div>
              </div>
            </div>
            
            {isTyping ? (
              <div className="flex items-center text-theme-green/70">
                <div className="animate-pulse mr-2">AI is analyzing your response...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-theme-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-theme-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-theme-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  placeholder="Type your answer here... Be detailed and specific to get a better score!"
                  className="w-full h-32 p-4 bg-theme-black/50 border border-theme-green/20 rounded-lg text-theme-green placeholder-theme-green/50 focus:border-theme-green/40 focus:outline-none resize-none"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-theme-green/60">
                    {(answers[currentQuestion.id] || "" || "").length} characters
                  </span>
                  <Button 
                    onClick={() => handleAnswerSubmit(answers[currentQuestion.id] || "")}
                    disabled={!answers[currentQuestion.id] || answers[currentQuestion.id].length < 10}
                    className="bg-gradient-to-r from-theme-green to-theme-green-light text-theme-black hover:from-theme-green-light hover:to-theme-green"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInterview;
