import * as React from 'react';
import type { Comment } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Send } from 'lucide-react';

interface CommentBoxProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  isSubmitting?: boolean;
}

export function CommentBox({ comments, onAddComment, isSubmitting = false }: CommentBoxProps) {
  const [newComment, setNewComment] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-4">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={comment.userAvatar} />
                <AvatarFallback>{comment.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 bg-muted/30 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{comment.userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.createdAt), 'MMM d, HH:mm')}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end space-x-2 pt-4 border-t">
        <div className="flex-1 space-y-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
        </div>
        <Button type="submit" size="icon" disabled={!newComment.trim() || isSubmitting} className="h-10 w-10 shrink-0">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send comment</span>
        </Button>
      </form>
    </div>
  );
}
