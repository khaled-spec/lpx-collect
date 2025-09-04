'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle, 
  HelpCircle,
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  content: string;
  helpful: number;
  images?: string[];
}

interface Question {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
}

interface ProductTabsProps {
  product: {
    description: string;
    specifications: Record<string, string>;
  };
  reviews: Review[];
  questions: Question[];
}

export default function ProductTabs({ product, reviews, questions }: ProductTabsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  // Calculate review statistics
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }));

  const filteredReviews = selectedRating 
    ? reviews.filter(r => r.rating === selectedRating)
    : reviews;

  const filteredQuestions = searchQuery
    ? questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : questions;

  return (
    <Tabs defaultValue="description" className="mt-12">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          Reviews
          <Badge variant="secondary" className="ml-1">
            {totalReviews}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="questions" className="flex items-center gap-2">
          Q&A
          <Badge variant="secondary" className="ml-1">
            {questions.length}
          </Badge>
        </TabsTrigger>
      </TabsList>

      {/* Description Tab */}
      <TabsContent value="description">
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Specifications Tab */}
      <TabsContent value="specifications">
        <Card>
          <CardHeader>
            <CardTitle>Product Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b last:border-0">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Reviews Tab */}
      <TabsContent value="reviews">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Review Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center my-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-5 w-5",
                        star <= averageRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {totalReviews} reviews
                </p>
              </div>

              <div className="col-span-2 space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <span className="w-4 text-sm">{rating}</span>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    </button>
                    <Progress value={percentage} className="flex-1 h-2" />
                    <span className="w-12 text-sm text-muted-foreground text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Filter */}
            {selectedRating && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredReviews.length} reviews with {selectedRating} stars
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                >
                  Clear filter
                </Button>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{review.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{review.author}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground ml-auto">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-4 w-4",
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {review.content}
                      </p>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Write Review */}
            <div className="pt-4">
              <Button className="w-full">
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Q&A Tab */}
      <TabsContent value="questions">
        <Card>
          <CardHeader>
            <CardTitle>Questions & Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="border-b pb-4 last:border-0">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{q.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Asked by {q.askedBy} • {q.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 ml-11">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{q.answer}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Answered by {q.answeredBy}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ask Question */}
            <div className="space-y-3 pt-4">
              <Label htmlFor="question">Have a question?</Label>
              <Textarea
                id="question"
                placeholder="Ask about this product..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={3}
              />
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}