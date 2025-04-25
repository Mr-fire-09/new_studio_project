
"use client";

import type { Question } from "@/services/quiz";
import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import { getQuestion } from "@/services/quiz";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2, TimerIcon, RotateCcw, Trophy, Target } from 'lucide-react';

const TOTAL_QUESTIONS = 5; // Define the total number of questions for the quiz
const TIME_PER_QUESTION = 15; // Seconds per question

export default function QuizQuestion() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [score, setScore] = useState<number>(0);
  const [animateScore, setAnimateScore] = useState<boolean>(false); // State for score animation trigger
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(TIME_PER_QUESTION);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    clearTimer();
    setTimer(TIME_PER_QUESTION);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearTimer();
          handleTimeUp(); // Auto-submit or handle time expiration
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  }, []); // Removed dependencies to prevent timer reset on re-renders other than question change

  const fetchNewQuestion = useCallback(() => {
    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
      setQuizFinished(true);
      clearTimer();
      return;
    }
    setIsLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSubmitted(false);
    startTransition(async () => {
      try {
        const q = await getQuestion();
        setQuestion(q);
        startTimer(); // Start timer for the new question
      } catch (error) {
        console.error("Failed to fetch question:", error);
        toast({
          title: "Error",
          description: "Failed to load the next question. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, startTimer, toast]); // Include dependencies

  useEffect(() => {
    fetchNewQuestion();
    // Cleanup timer on unmount
    return () => clearTimer();
  }, [fetchNewQuestion]);


  const handleAnswerSelection = (value: string) => {
    if (!submitted) {
      setSelectedAnswer(value);
    }
  };

  const handleTimeUp = () => {
    if (!submitted) {
      // Automatically submit as incorrect when time runs out
      setIsCorrect(false);
      setSubmitted(true);
      clearTimer();
      toast({
        title: "Time's Up!",
        description: `The correct answer was: ${question?.options[question.correctAnswerIndex]}`,
        variant: "destructive",
        duration: 4000,
      });
    }
  };


  const handleSubmit = () => {
    if (selectedAnswer === null || !question || submitted) return;

    clearTimer(); // Stop the timer on submission
    setIsSubmitting(true);

    const correct = question.options.indexOf(selectedAnswer) === question.correctAnswerIndex;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
        setScore((prevScore) => {
            const newScore = prevScore + 1;
            setAnimateScore(true); // Trigger animation
            setTimeout(() => setAnimateScore(false), 600); // Reset animation state after duration
            return newScore;
        });
    }

    setTimeout(() => { // Keep simulation for feedback
      setIsSubmitting(false);
      toast({
        title: correct ? "Correct!" : "Incorrect",
        description: correct ? "Awesome!" : `The correct answer was: ${question.options[question.correctAnswerIndex]}`,
        variant: correct ? "default" : "destructive",
        duration: 3000,
      });
    }, 300); // Short delay for feedback
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      // fetchNewQuestion will be called by the useEffect watching currentQuestionIndex
    } else {
      setQuizFinished(true);
      clearTimer();
    }
  };

   const handleRestartQuiz = () => {
     setScore(0);
     setCurrentQuestionIndex(0);
     setQuizFinished(false);
     setIsLoading(true); // Show loading state while fetching the first question again
     // fetchNewQuestion will be called by the useEffect watching currentQuestionIndex or a direct call here
     // Direct call might be more immediate:
     startTransition(async () => {
        try {
            const q = await getQuestion();
            setQuestion(q);
            startTimer();
        } catch (error) {
            console.error("Failed to fetch question:", error);
            toast({ title: "Error", description: "Failed to restart quiz.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
     });
   };

  const getOptionStyle = (option: string) => {
    const baseStyle = "border rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus-within:scale-[1.02] focus-within:shadow-lg"; // Added hover/focus animation

    if (!submitted) {
        return `${baseStyle} ${selectedAnswer === option ? "border-primary ring-2 ring-primary shadow-md" : "border-border hover:border-primary/70"}`;
    }

    const isCorrectAnswer = question && question.options.indexOf(option) === question.correctAnswerIndex;
    const isSelected = selectedAnswer === option;

    if (isCorrectAnswer) {
        return `${baseStyle} bg-green-100 border-green-500 text-green-900 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300 ring-2 ring-green-500 shadow-md scale-100`; // Ensure final state is not scaled
    }
    if (isSelected && !isCorrect) {
        return `${baseStyle} bg-red-100 border-red-500 text-red-900 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 ring-2 ring-red-500 shadow-md scale-100`; // Ensure final state is not scaled
    }
    return `${baseStyle} border-border opacity-60 cursor-default pointer-events-none`; // Fade out non-selected, non-correct options, disable interaction
  };


  const getOptionIcon = (option: string) => {
    if (!submitted) return null;

    const isCorrectAnswer = question && question.options.indexOf(option) === question.correctAnswerIndex;
     const isSelected = selectedAnswer === option;


    if (isCorrectAnswer) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (isSelected && !isCorrect) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    }
    return <span className="h-5 w-5"></span>; // Placeholder for alignment
  }


  if (isLoading || isPending) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl bg-card/80 backdrop-blur-sm"> {/* Added subtle transparency */}
        <CardHeader className="p-6">
           <Skeleton className="h-5 w-1/4 mb-4 bg-muted/50" /> {/* Progress skeleton */}
          <Skeleton className="h-6 w-3/4 mb-2 bg-muted/50" />
          <Skeleton className="h-4 w-1/2 bg-muted/50" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
             <Skeleton className="h-5 w-1/5 mb-4 ml-auto bg-muted/50" /> {/* Timer skeleton */}
            <Skeleton className="h-14 w-full rounded-lg bg-muted/50" />
            <Skeleton className="h-14 w-full rounded-lg bg-muted/50" />
            <Skeleton className="h-14 w-full rounded-lg bg-muted/50" />
            <Skeleton className="h-14 w-full rounded-lg bg-muted/50" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-secondary/30">
          <Skeleton className="h-5 w-1/6 bg-muted/50" /> {/* Score skeleton */}
          <Skeleton className="h-10 w-28 bg-muted/50" />
        </CardFooter>
      </Card>
    );
  }

  if (quizFinished) {
     return (
       <Card className="w-full max-w-lg mx-auto shadow-xl rounded-xl overflow-hidden text-center bg-card/90 backdrop-blur-sm animate-fadeIn"> {/* Added transparency and animation */}
         <CardHeader className="bg-primary/90 p-8"> {/* Slightly transparent header */}
           <CardTitle className="text-3xl font-bold text-primary-foreground">Quiz Finished!</CardTitle>
            <Trophy className="mx-auto h-16 w-16 text-yellow-400 mt-4 animate-bounce" /> {/* Bounce animation */}
         </CardHeader>
         <CardContent className="p-8 space-y-4">
           <p className="text-xl text-muted-foreground">Your final score is:</p>
           <p className="text-5xl font-bold text-primary">{score} / {TOTAL_QUESTIONS}</p>
           <p className="text-lg">
             {score === TOTAL_QUESTIONS ? "Perfect score! 🎉" : score >= TOTAL_QUESTIONS / 2 ? "Well done!" : "Keep practicing!"}
            </p>
         </CardContent>
         <CardFooter className="p-6 bg-secondary/30 flex justify-center">
           <Button onClick={handleRestartQuiz} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground transform hover:scale-105 transition-transform"> {/* Added hover scale */}
              <RotateCcw className="mr-2 h-5 w-5" /> Play Again
           </Button>
         </CardFooter>
       </Card>
     );
   }


  if (!question) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl bg-card/80 backdrop-blur-sm"> {/* Added transparency */}
        <CardHeader className="p-6">
          <CardTitle className="text-xl text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-destructive-foreground">Could not load the question. Please try refreshing the page or check your connection.</p>
        </CardContent>
         <CardFooter className="p-6 flex justify-end">
            <Button onClick={fetchNewQuestion} variant="outline">Retry</Button>
         </CardFooter>
      </Card>
    );
  }

  const progressValue = ((currentQuestionIndex + (submitted ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl rounded-xl overflow-hidden border border-border bg-card/90 backdrop-blur-sm"> {/* Enhanced shadow, added transparency */}
       <CardHeader className="p-6 border-b border-border bg-secondary/30">
          <div className="flex justify-between items-center mb-4">
             <Progress value={progressValue} className="w-2/3 h-2" aria-label={`Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`}/>
             <div className={`flex items-center text-sm font-medium p-1 px-2 rounded ${timer <= 5 ? 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/30 animate-pulse' : 'text-muted-foreground'}`}> {/* Added pulse animation for low time */}
               <TimerIcon className="h-4 w-4 mr-1" />
               {timer}s
             </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-primary leading-tight">{question.text}</CardTitle>
         <CardDescription className="text-muted-foreground pt-1 text-base">Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}. Select the best answer.</CardDescription>
       </CardHeader>
       <CardContent className="p-6">
         <RadioGroup
           value={selectedAnswer ?? undefined}
           onValueChange={handleAnswerSelection}
           disabled={submitted || isSubmitting}
           className="space-y-4"
         >
           {question.options.map((option, index) => (
             <Label
               key={index}
               htmlFor={`option-${index}`}
               className={`flex items-center justify-between p-4 ${getOptionStyle(option)}`}
               aria-live="polite" // Announce changes for screen readers
             >
               <div className="flex items-center space-x-3">
                  <RadioGroupItem
                     value={option}
                     id={`option-${index}`}
                     className="border-primary text-accent focus:ring-accent disabled:opacity-50 h-5 w-5" // Slightly larger radio items
                     disabled={submitted || isSubmitting}
                     aria-label={`Option ${index + 1}: ${option}`}
                  />
                 <span className="text-base">{option}</span> {/* Increased text size */}
               </div>
                {getOptionIcon(option)}
             </Label>
           ))}
         </RadioGroup>
       </CardContent>
       <CardFooter className="flex justify-between items-center p-6 bg-secondary/30 border-t border-border">
          <div className="text-lg font-semibold text-primary flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary/80" /> Score: <span className={`ml-1 ${animateScore ? 'animate-bounce-short' : ''}`}>{score}</span> {/* Apply animation class */}
          </div>
         {submitted ? (
            <Button onClick={handleNextQuestion} className="bg-accent hover:bg-accent/90 text-accent-foreground min-w-[150px] text-base py-2.5 px-6 transform transition-transform hover:scale-105"> {/* Added hover scale */}
             {currentQuestionIndex === TOTAL_QUESTIONS - 1 ? 'Finish Quiz' : 'Next Question'}
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
               <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
             </svg>
           </Button>
         ) : (
           <Button
             onClick={handleSubmit}
             disabled={selectedAnswer === null || isSubmitting || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[150px] text-base py-2.5 px-6 transform transition-transform hover:scale-105" // Added hover scale
              aria-label="Submit your answer"
           >
             {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
             Submit
           </Button>
         )}
       </CardFooter>
     </Card>
   );
 }
