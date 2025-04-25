"use client";

import type { Question } from "@/services/quiz";
import { useState, useEffect, useTransition } from "react";
import { getQuestion } from "@/services/quiz";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function QuizQuestion() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const fetchNewQuestion = () => {
    setIsLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setSubmitted(false);
    startTransition(async () => {
      try {
        const q = await getQuestion();
        setQuestion(q);
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
  };

  useEffect(() => {
    fetchNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch question on initial load

  const handleAnswerSelection = (value: string) => {
    if (!submitted) {
      setSelectedAnswer(value);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !question) return;

    setIsSubmitting(true);
    // Simulate submission delay / API call
    setTimeout(() => {
      const correct = question.options.indexOf(selectedAnswer) === question.correctAnswerIndex;
      setIsCorrect(correct);
      setSubmitted(true);
      setIsSubmitting(false);
      toast({
        title: correct ? "Correct!" : "Incorrect",
        description: correct ? "Well done!" : `The correct answer was: ${question.options[question.correctAnswerIndex]}`,
        variant: correct ? "default" : "destructive", // 'default' usually looks neutral, maybe create a 'success' variant
        duration: 3000,
      });
    }, 500); // Simulate network latency
  };

  const handleNextQuestion = () => {
    fetchNewQuestion();
  };

  const getOptionStyle = (option: string) => {
    if (!submitted) {
      return selectedAnswer === option ? "bg-accent/20 border-accent" : "border-border";
    }

    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = question && question.options.indexOf(option) === question.correctAnswerIndex;

    if (isCorrectAnswer) {
      return "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300";
    }
    if (isSelected && !isCorrect) {
      return "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";
    }
    return "border-border opacity-70"; // Fade out non-selected, non-correct options
  };

  const getOptionIcon = (option: string) => {
    if (!submitted) return null;

    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = question && question.options.indexOf(option) === question.correctAnswerIndex;

    if (isCorrectAnswer) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (isSelected && !isCorrect) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return null;
  }


  if (isLoading || isPending) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  if (!question) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load the question. Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-secondary/50 p-6">
        <CardTitle className="text-xl font-semibold text-primary">{question.text}</CardTitle>
        <CardDescription className="text-muted-foreground pt-1">Select the best answer below.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup
          value={selectedAnswer ?? undefined}
          onValueChange={handleAnswerSelection}
          disabled={submitted || isSubmitting}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out ${getOptionStyle(option)} ${submitted ? 'cursor-default' : 'hover:border-accent hover:bg-accent/10'}`}
            >
              <div className="flex items-center space-x-3">
                 <RadioGroupItem
                    value={option}
                    id={`option-${index}`}
                    className="border-primary text-accent focus:ring-accent disabled:opacity-50"
                    disabled={submitted || isSubmitting}
                 />
                <span>{option}</span>
              </div>
               {getOptionIcon(option)}
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-end p-6 bg-secondary/50">
        {submitted ? (
          <Button onClick={handleNextQuestion} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Next Question
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
