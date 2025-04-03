'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  level: number;
  content: string;
  options: string[];
  correctAnswer: string;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    level: 1,
    content: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: '2',
    type: 'multiple-choice',
    level: 2,
    content: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctAnswer: 'Mars',
  },
  {
    id: '3',
    type: 'multiple-choice',
    level: 1,
    content: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const filteredQuestions = questions.filter((question) => {
    return (
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedType === '' || question.type === selectedType) &&
      (selectedLevel === '' || question.level.toString() === selectedLevel)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground">
            Manage test questions for entrance and periodic tests
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Question</DialogTitle>
              <DialogDescription>Create a new question for the test bank</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select defaultValue="multiple-choice">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Level 1 (Easy)</SelectItem>
                      <SelectItem value="2">Level 2 (Medium)</SelectItem>
                      <SelectItem value="3">Level 3 (Hard)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Question</Label>
                <Textarea id="content" placeholder="Enter your question" />
              </div>
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox id={`correct-${index}`} />
                      <Label htmlFor={`correct-${index}`} className="w-[30px]">
                        {option}
                      </Label>
                      <Input placeholder={`Option ${option}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation (Optional)</Label>
                <Textarea id="explanation" placeholder="Explanation for the correct answer" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Question</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="filter-type">Question Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger id="filter-type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              <SelectItem value="true-false">True/False</SelectItem>
              <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="filter-level">Difficulty Level</Label>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger id="filter-level">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              <SelectItem value="1">Level 1 (Easy)</SelectItem>
              <SelectItem value="2">Level 2 (Medium)</SelectItem>
              <SelectItem value="3">Level 3 (Hard)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card>
            <CardContent className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No questions found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{question.content}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Type: {question.type} | Level: {question.level}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${option === question.correctAnswer ? 'bg-green-500' : 'bg-muted'}`}
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
