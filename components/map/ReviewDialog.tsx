"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Star, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { AmalaSpotNew, Review } from "@/types/type";
import { BASE_URL } from "@/data/data";
import axios from "axios";
import useUserStore from "@/store/useUserStore";
import { getCookie } from "@/actions/handleCookies";
import { toast } from "sonner";

interface ReviewDialogProps {
  spot: AmalaSpotNew;
  setIsAuthModalOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function ReviewDialog({ spot, setIsAuthModalOpen, open, setOpen }: ReviewDialogProps) {
  const [mode, setMode] = useState<"view" | "create">("view");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState<Number>(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = await getCookie("amalajeun_token");
      if (!token?.value) {
        setOpen(false); 
        setTimeout(() => setIsAuthModalOpen(true), 300);
        setIsLoading(false);
        return;
      }
      const res = await axios.post(
        `${BASE_URL()}/api/v1/reviews`,
        {
          spot_id: spot.id,
          rating: rating,
          comment: comment,
          user_name: user?.name,
          user: {...user},
          spot: {...spot},
        },
        {
          headers: {
            Authorization: `Bearer ${token?.value}`,
          },
        }
      );

      if (res.status == 201) {
        toast.message("Your review was submitted successfully.");
        setMode("view");
        setRating(0);
        setComment("");
        // Refresh reviews after submit
        fetchReviews();
      }
    } catch (err) {
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(0);
    setComment("");
    setMode("view");
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-4 w-4",
              interactive && "cursor-pointer transition-colors hover:scale-110",
              star <= (interactive ? hoveredStar || rating : currentRating)
                ? "fill-primary text-primary"
                : "text-muted-foreground"
            )}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await axios.get(`${BASE_URL()}/api/v1/reviews/${spot.id}`);
      if (res.status == 200) {
        setReviews(res?.data.data || []);
        setAvgRating(res?.data.spot?.average_rating || 0);
      } else {
        setReviews([]);
        setAvgRating(0);
      }
    } catch (err) {
      setReviews([]);
      setAvgRating(0);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary border-2 border-primary bg-transparent">Reviews</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {mode === "view" ? "Reviews" : "Write a Review"}
            {mode === "view" && (
              <Button onClick={() => setMode("create")} size="sm">
                Write Review
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? `${reviews.length} review${reviews.length !== 1 ? "s" : ""} • Average: ${avgRating} stars`
              : "Share your experience with others"}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" ? (
          <ScrollArea className="max-h-[60vh] pr-4">
            {isLoadingReviews ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-muted-foreground">Loading reviews…</span>
              </div>
            ) : reviews && reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reviews yet</p>
                <p className="text-sm">
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={review.id}>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {review.user_name?.charAt(0).toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {review.user_name}
                          </span>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.comment}
                        </p>
                        {review.created_at && (
                          <p className="text-xs text-muted-foreground">
                            {review.created_at.slice(0, 10)}
                          </p>
                        )}
                      </div>
                    </div>
                    {index < reviews.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-2">
                {renderStars(rating, true)}
                <span className="text-sm text-muted-foreground ml-2">
                  {rating > 0
                    ? `${rating} star${rating !== 1 ? "s" : ""}`
                    : "Select a rating"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || !comment.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
