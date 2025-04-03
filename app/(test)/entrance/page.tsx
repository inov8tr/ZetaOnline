'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: string;
}

// Mock questions - in a real app, these would come from your database
const mockQuestions: Question[] = [
  {
    id: '1',
    content: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: '2',
    content: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctAnswer: 'Mars',
  },
  {
    id: '3',
    content: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
];

export default function EntranceTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [mockQuestions[currentQuestion].id]: value,
    });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // In a real app, you would submit the answers to your API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to the results page
    router.push('/dashboard/student');
  };

  const isLastQuestion = currentQuestion === mockQuestions.length - 1;
  const question = mockQuestions[currentQuestion];
  const selectedAnswer = answers[question.id] || '';

  return (
    <div className="container mx-auto grid min-h-screen place-items-center py-8">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Entrance Test</h1>
          <p className="text-muted-foreground">
            Please answer the following questions to determine your skill level.
          </p>
        </div>

        <div className="flex justify-between">
          <span>
            Question {currentQuestion + 1} of {mockQuestions.length}
          </span>
          <span>Time remaining: 30:00</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{question.content}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswer}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </Button>
            {isLastQuestion ? (
              <Button onClick={handleSubmit} disabled={isSubmitting || !selectedAnswer}>
                {isSubmitting ? 'Submitting...' : 'Submit Test'}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!selectedAnswer}>
                Next
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-wrap gap-2">
          {mockQuestions.map((_, index) => (
            <Button
              key={index}
              variant={
                index === currentQuestion
                  ? 'default'
                  : answers[mockQuestions[index].id]
                    ? 'outline'
                    : 'ghost'
              }
              size="sm"
              onClick={() => setCurrentQuestion(index)}
              className="h-10 w-10 rounded-full p-0"
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
