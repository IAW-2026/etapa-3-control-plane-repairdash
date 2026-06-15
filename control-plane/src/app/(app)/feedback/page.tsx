'use client';
import { useSyncRoute } from '@/lib/routes';
import { FeedbackView } from '@/features/feedback/FeedbackView';

export default function FeedbackPage() {
  useSyncRoute('feedback');
  return <FeedbackView />;
}
